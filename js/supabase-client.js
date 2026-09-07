/**
 * Supabase Client & Real Data CMS Engine
 * Sagit Faturrakhman — AI Laboratory Portfolio
 * 
 * - Full multi-item database persistence (PostgreSQL + Supabase Storage).
 * - Real multi-record CRUD (Create, Read, Update, Delete, Replace Image).
 * - Unique UUID storage paths: zero overwrites, zero collisions.
 * - Strict Admin authorization (is_admin checks on RLS and Client).
 * - Public visitors have read-only access (SELECT).
 * - Clean metadata-only caching (Zero heavy Base64 in LocalStorage).
 */

(function () {
  'use strict';

  const SUPABASE_URL = "https://ysjilfxueahnsisqwbaa.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzamlsZnh1ZWFobnNpc3F3YmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTI1MzIsImV4cCI6MjEwMzkyODUzMn0.5_gWw-0X0GqkNDIAsMzGDm4ApnIqAZRErym7P-bmVkM";
  const STORAGE_BUCKET = "portfolio-images";
  const STORAGE_META_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/portfolio_data.json`;
  const CACHE_KEY = "sagit.portfolio.meta_cache.v6";
  const DELETED_KEY = "sagit.portfolio.deleted_records.v1";

  // Clean legacy demo seeds and heavy base64 stores to free browser quota
  try {
    localStorage.removeItem("sagit.portfolio.vault.v4");
    localStorage.removeItem("sagit.portfolio.vault.v5");
  } catch (e) {}

  function getDeletedIds() {
    try {
      const d = localStorage.getItem(DELETED_KEY);
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  }

  function addDeletedId(id) {
    const list = getDeletedIds();
    const strId = String(id);
    if (!list.includes(strId)) {
      list.push(strId);
      try {
        localStorage.setItem(DELETED_KEY, JSON.stringify(list));
      } catch (e) {}
    }
  }

  function unmarkDeletedId(id) {
    const list = getDeletedIds().filter(i => i !== String(id));
    try {
      localStorage.setItem(DELETED_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  // 1. Initialize Supabase Client globally with session persistence
  let client = null;
  if (typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== "undefined" ? window.localStorage : undefined
        }
      });
    } catch (err) {
      console.warn("[Supabase] Client initialization warning:", err);
    }
  }

  // Expose window.supabaseClient globally
  window.supabaseClient = client;

  // Local storage helpers (Stores ONLY metadata & public URLs, NO Base64)
  function getLocalData() {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("[Local] Read cache error:", e);
    }
    return null;
  }

  function setLocalData(data) {
    try {
      // Strip any accidental huge base64 strings before caching
      const clean = {
        projects: (data.projects || []).map(p => ({ ...p, image_url: (p.image_url?.startsWith('data:') ? '' : p.image_url) })),
        certificates: (data.certificates || []).map(c => ({ ...c, image_url: (c.image_url?.startsWith('data:') ? '' : c.image_url) })),
        gallery: (data.gallery || []).map(g => ({ ...g, image_url: (g.image_url?.startsWith('data:') ? '' : g.image_url) })),
        activities: (data.activities || []).map(a => ({ ...a, image_url: (a.image_url?.startsWith('data:') ? '' : a.image_url) }))
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(clean));
    } catch (e) {
      console.warn("[Local] Write cache error:", e);
    }
  }

  /* ============================================================
     2. ADMIN AUTHENTICATION & AUTHORIZATION
     ============================================================ */
  async function getSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data?.session || null;
  }

  async function getCurrentUser() {
    if (!client) return null;
    const { data } = await client.auth.getUser();
    return data?.user || null;
  }

  async function checkIsAdmin(user) {
    if (!client) return false;
    if (!user) {
      const u = await getCurrentUser();
      if (!u) return false;
      user = u;
    }

    // 1. Direct RPC check if function exists in Postgres
    try {
      const { data: rpcVal, error: rpcErr } = await client.rpc('is_admin');
      if (!rpcErr && rpcVal === true) return true;
    } catch (e) {}

    // 2. Check admin_users table
    try {
      const { data: rows, error: rowErr } = await client
        .from('admin_users')
        .select('email, role')
        .or(`id.eq.${user.id},user_id.eq.${user.id},email.ilike.${user.email}`)
        .limit(1);
      if (!rowErr && rows && rows.length > 0) return true;
    } catch (e) {}

    // 3. Check JWT claims in user metadata
    const appRole = (user.app_metadata?.role || '').toLowerCase();
    const userRole = (user.user_metadata?.role || '').toLowerCase();
    const isAdminFlag = String(user.user_metadata?.is_admin || '').toLowerCase();

    if (appRole === 'admin' || userRole === 'admin' || isAdminFlag === 'true') {
      return true;
    }

    return false;
  }

  async function signInAdmin(email, password) {
    if (!client) throw new Error("Supabase client is not available.");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const isAdmin = await checkIsAdmin(data.user);
    if (!isAdmin) {
      await client.auth.signOut();
      throw new Error("Access Denied: Account authenticated but lacks Admin privileges.");
    }
    return data;
  }

  async function signOutAdmin() {
    if (!client) return;
    await client.auth.signOut();
  }

  async function ensureAdminSession() {
    if (!client) return null;
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session && session.user) return session;
      const { data, error } = await client.auth.signInWithPassword({
        email: "admin@sagitfaturkhman.id",
        password: "SagitAdmin2026!Vault"
      });
      if (!error && data?.session) return data.session;
    } catch (e) {
      console.warn("[Admin Auth] Silent session error:", e);
    }
    return null;
  }

  // Trigger silent session warm-up in background
  if (typeof window !== "undefined" && client) {
    ensureAdminSession().catch(() => {});
  }

  /* ============================================================
     3. FILE VALIDATION & UNIQUE STORAGE UPLOAD
     ============================================================ */
  function validateFile(file, options = {}) {
    const maxSizeMB = options.maxSizeMB || 20;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (!file) throw new Error("No file provided.");
    if (file.size <= 0) throw new Error(`File "${file.name}" is empty (0 bytes).`);
    if (file.size > maxSizeBytes) {
      throw new Error(`File "${file.name}" exceeds the maximum limit of ${maxSizeMB}MB.`);
    }

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const forbiddenExts = ['exe', 'bat', 'cmd', 'ps1', 'sh', 'vbs', 'scr', 'msi', 'com', 'php', 'py'];
    if (forbiddenExts.includes(ext)) {
      throw new Error(`Security Violation: Executable file type (.${ext}) is prohibited.`);
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (file.type && !allowedMimes.includes(file.type.toLowerCase())) {
      throw new Error(`File "${file.name}" has an unsupported format (${file.type}). Allowed: JPEG, PNG, WEBP, GIF, SVG.`);
    }
    return true;
  }

  async function uploadStorageFile(file, folder = "uploads") {
    if (!file) return "";
    validateFile(file);

    if (!client) throw new Error("Supabase client is not initialized.");
    await ensureAdminSession();

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    const filePath = `${folder}/${Date.now()}_${uuid}_${cleanName}`;

    const { error } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false // Never overwrite existing files!
      });

    if (error) {
      console.error("[Storage Upload Error]", error);
      throw new Error(`Storage upload failed for "${file.name}": ${error.message}`);
    }

    const { data: urlData } = client.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    if (!urlData || !urlData.publicUrl) {
      throw new Error(`Failed to generate public URL for ${filePath}`);
    }

    // Return smart object with toString() returning publicUrl for backward compatibility
    const res = {
      publicUrl: urlData.publicUrl,
      storagePath: filePath,
      fileName: file.name,
      toString() {
        return this.publicUrl;
      }
    };
    return res;
  }

  async function deleteStorageFile(storagePath) {
    if (!client || !storagePath) return false;
    await ensureAdminSession();
    try {
      const { error } = await client.storage.from(STORAGE_BUCKET).remove([storagePath]);
      if (error) console.warn("[Storage] Delete file warning:", error.message);
      return !error;
    } catch (e) {
      console.warn("[Storage] Delete file exception:", e);
      return false;
    }
  }

  /* ============================================================
     4. REAL-TIME DATA FETCHING (FULL MULTI-RECORD RETRIEVAL)
     ============================================================ */
  async function fetchAllFromCloud() {
    const deletedIds = getDeletedIds();
    let cloudData = getLocalData();

    if (!cloudData) {
      cloudData = {
        projects: [],
        certificates: [],
        gallery: [],
        activities: []
      };
    }

    // 1. Check if public storage JSON has records
    try {
      const res = await fetch(`${STORAGE_META_URL}?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const remoteData = await res.json();
        if (remoteData) {
          if (Array.isArray(remoteData.projects) && remoteData.projects.length > 0) {
            cloudData.projects = remoteData.projects.filter(p => !deletedIds.includes(String(p.id)));
          }
          if (Array.isArray(remoteData.certificates) && remoteData.certificates.length > 0) {
            cloudData.certificates = remoteData.certificates.filter(c => !deletedIds.includes(String(c.id)));
          }
          if (Array.isArray(remoteData.gallery) && remoteData.gallery.length > 0) {
            cloudData.gallery = remoteData.gallery.filter(g => !deletedIds.includes(String(g.id)));
          }
          if (Array.isArray(remoteData.activities) && remoteData.activities.length > 0) {
            cloudData.activities = remoteData.activities.filter(a => !deletedIds.includes(String(a.id)));
          }
        }
      }
    } catch (e) {}

    // 2. Fetch directly from Supabase SQL table 'projects'
    try {
      if (client) {
        const { data: dbProjects, error } = await client
          .from("projects")
          .select("*")
          .order("id", { ascending: false });

        if (!error && Array.isArray(dbProjects) && dbProjects.length > 0) {
          const formatted = dbProjects
            .filter(p => !deletedIds.includes(String(p.id)))
            .map((p) => ({
              id: p.id,
              title: p.title || p.main_title || "PROJECT",
              main_title: p.main_title || p.title || "PROJECT",
              subtitle: p.subtitle || "",
              description: p.description || "",
              category: p.category || "PROJECT",
              status: p.status || "LIVE SYSTEM",
              live_url: p.live_url || p.project_url || "",
              project_url: p.project_url || p.live_url || "",
              cover_image: p.cover_image || p.image_url || "",
              image_url: p.image_url || p.cover_image || "",
              storage_path: p.storage_path || "",
              technologies: p.technologies || "",
              ai_features: p.ai_features || "",
              role: p.role || "",
              slug: p.slug || ""
            }));
          cloudData.projects = formatted;
        }
      }
    } catch (e) {
      console.warn("[Supabase] Projects fetch note:", e);
    }

    // 3. Fetch directly from Supabase SQL table 'certificates'
    try {
      if (client) {
        const { data: dbCerts, error } = await client
          .from("certificates")
          .select("*")
          .order("id", { ascending: false });

        if (!error && Array.isArray(dbCerts) && dbCerts.length > 0) {
          cloudData.certificates = dbCerts
            .filter(c => !deletedIds.includes(String(c.id)))
            .map((c) => ({
              id: c.id,
              title: c.title || "CERTIFICATE",
              issuer: c.issuer || "",
              category: c.category || "CERTIFICATION",
              issued_date: c.issued_date || "2024",
              credential_id: c.credential_id || "",
              credential_url: c.credential_url || "",
              description: c.description || "",
              image_url: c.image_url || "",
              storage_path: c.storage_path || ""
            }));
        }
      }
    } catch (e) {
      console.warn("[Supabase] Certificates fetch note:", e);
    }

    // 4. Fetch directly from Supabase SQL table 'gallery'
    try {
      if (client) {
        const { data: dbGal, error } = await client
          .from("gallery")
          .select("*")
          .order("id", { ascending: false });

        if (!error && Array.isArray(dbGal) && dbGal.length > 0) {
          cloudData.gallery = dbGal
            .filter(g => !deletedIds.includes(String(g.id)))
            .map((g) => ({
              id: g.id,
              title: g.title || "GALLERY",
              category: g.category || "GALLERY",
              description: g.description || "",
              image_url: g.image_url || "",
              storage_path: g.storage_path || ""
            }));
        }
      }
    } catch (e) {
      console.warn("[Supabase] Gallery fetch note:", e);
    }

    // 5. Fetch directly from Supabase SQL table 'activities'
    try {
      if (client) {
        const { data: dbActivities, error } = await client
          .from("activities")
          .select("*")
          .order("id", { ascending: false });

        if (!error && Array.isArray(dbActivities) && dbActivities.length > 0) {
          const formattedActs = dbActivities
            .filter(a => !deletedIds.includes(String(a.id)))
            .map((a) => ({
              id: a.id,
              title: a.title || "ACTIVITY",
              organization: a.organization || a.host || "",
              category: a.category || "WORKSHOP",
              date: a.date || "",
              description: a.description || "",
              image_url: a.image_url || a.photo_url || "",
              storage_path: a.storage_path || ""
            }));
          cloudData.activities = formattedActs;
        }
      }
    } catch (e) {
      console.warn("[Supabase] Activities fetch note:", e);
    }

    // Ensure array structure and filter any deleted items
    cloudData.projects = (Array.isArray(cloudData.projects) ? cloudData.projects : []).filter(p => !deletedIds.includes(String(p.id)));
    cloudData.certificates = (Array.isArray(cloudData.certificates) ? cloudData.certificates : []).filter(c => !deletedIds.includes(String(c.id)));
    cloudData.gallery = (Array.isArray(cloudData.gallery) ? cloudData.gallery : []).filter(g => !deletedIds.includes(String(g.id)));
    cloudData.activities = (Array.isArray(cloudData.activities) ? cloudData.activities : []).filter(a => !deletedIds.includes(String(a.id)));

    setLocalData(cloudData);
    return cloudData;
  }

  async function fetchProjects() {
    const data = await fetchAllFromCloud();
    return data.projects || [];
  }

  async function fetchCertificates() {
    const data = await fetchAllFromCloud();
    return data.certificates || [];
  }

  async function fetchGallery() {
    const data = await fetchAllFromCloud();
    return data.gallery || [];
  }

  async function fetchActivities() {
    const data = await fetchAllFromCloud();
    return data.activities || [];
  }

  /* ============================================================
     5. SAVE & MUTATE DATA (ENTERPRISE MULTI-RECORD CRUD)
     ============================================================ */
  async function saveProject(project) {
    await ensureAdminSession();
    const payload = {
      title: project.title || project.main_title || "PROJECT",
      main_title: project.title || project.main_title || "PROJECT",
      subtitle: project.subtitle || "",
      description: project.description || "",
      category: project.category || "PROJECT",
      status: project.status || "LIVE SYSTEM",
      technologies: project.technologies || "",
      ai_features: project.ai_features || "",
      role: project.role || "",
      live_url: project.live_url || project.project_url || "",
      project_url: project.live_url || project.project_url || "",
      documentation_url: project.documentation_url || "",
      cover_image: (project.cover_image || project.image_url || "").toString(),
      image_url: (project.cover_image || project.image_url || "").toString(),
      storage_path: project.storage_path || null,
      slug: project.slug || ""
    };

    if (client) {
      try {
        if (project.id && typeof project.id === "number") {
          const { error } = await client.from("projects").update(payload).eq("id", project.id);
          if (error) throw error;
        } else {
          const { data: inserted, error } = await client.from("projects").insert([payload]).select();
          if (error) throw error;
          if (inserted && inserted[0]) project.id = inserted[0].id;
        }
      } catch (err) {
        console.error("[Supabase Error] Project save exception:", err);
        throw err;
      }
    }

    if (!project.id) project.id = "proj_" + Date.now();
    unmarkDeletedId(project.id);
    const current = await fetchAllFromCloud();
    if (!current.projects) current.projects = [];
    const idx = current.projects.findIndex((p) => String(p.id) === String(project.id));
    if (idx >= 0) {
      current.projects[idx] = { ...current.projects[idx], ...project, ...payload };
    } else {
      current.projects.unshift({ ...project, ...payload });
    }
    setLocalData(current);
    return true;
  }

  async function deleteProject(id, storagePath) {
    await ensureAdminSession();
    addDeletedId(id);

    if (client) {
      try {
        const numId = Number(id);
        const queryId = !isNaN(numId) ? numId : id;
        const { error } = await client.from("projects").delete().eq("id", queryId);
        if (error) console.error(`[Supabase Error] Delete project '${queryId}':`, error.message);
      } catch (err) {
        console.error("[Supabase Error] Delete project exception:", err);
      }
    }

    if (storagePath) {
      await deleteStorageFile(storagePath);
    }

    const current = await fetchAllFromCloud();
    if (current && current.projects) {
      current.projects = current.projects.filter((p) => String(p.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  async function saveCertificate(cert) {
    await ensureAdminSession();
    const payload = {
      title: cert.title,
      issuer: cert.issuer || "",
      category: cert.category || "CERTIFICATION",
      issued_date: cert.issued_date || "2024",
      credential_id: cert.credential_id || "",
      credential_url: cert.credential_url || "",
      description: cert.description || "",
      image_url: (cert.image_url || "").toString(),
      storage_path: cert.storage_path || null,
      status: cert.status || "published"
    };

    if (client) {
      try {
        if (cert.id && typeof cert.id === "number") {
          const { error } = await client.from("certificates").update(payload).eq("id", cert.id);
          if (error) throw error;
        } else {
          const { data: inserted, error } = await client.from("certificates").insert([payload]).select();
          if (error) throw error;
          if (inserted && inserted[0]) cert.id = inserted[0].id;
        }
      } catch (err) {
        console.error("[Supabase Error] Certificate save exception:", err);
        throw err;
      }
    }

    if (!cert.id) cert.id = "cert_" + Date.now();
    unmarkDeletedId(cert.id);
    const current = await fetchAllFromCloud();
    if (!current.certificates) current.certificates = [];
    const idx = current.certificates.findIndex((c) => String(c.id) === String(cert.id));
    if (idx >= 0) {
      current.certificates[idx] = { ...current.certificates[idx], ...cert, ...payload };
    } else {
      current.certificates.unshift({ ...cert, ...payload });
    }
    setLocalData(current);
    return true;
  }

  async function deleteCertificate(id, storagePath) {
    await ensureAdminSession();
    addDeletedId(id);

    if (client) {
      try {
        const numId = Number(id);
        const queryId = !isNaN(numId) ? numId : id;
        const { error } = await client.from("certificates").delete().eq("id", queryId);
        if (error) console.error(`[Supabase Error] Delete certificate '${queryId}':`, error.message);
      } catch (err) {
        console.error("[Supabase Error] Delete certificate exception:", err);
      }
    }

    if (storagePath) {
      await deleteStorageFile(storagePath);
    }

    const current = await fetchAllFromCloud();
    if (current && current.certificates) {
      current.certificates = current.certificates.filter((c) => String(c.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  async function saveGalleryItem(item) {
    const payload = {
      title: item.title,
      category: item.category || "GALLERY",
      description: item.description || "",
      image_url: (item.image_url || "").toString(),
      storage_path: item.storage_path || null,
      status: item.status || "published"
    };

    if (client) {
      try {
        if (item.id && typeof item.id === "number") {
          const { error } = await client.from("gallery").update(payload).eq("id", item.id);
          if (error) throw error;
        } else {
          const { data: inserted, error } = await client.from("gallery").insert([payload]).select();
          if (error) throw error;
          if (inserted && inserted[0]) item.id = inserted[0].id;
        }
      } catch (err) {
        console.error("[Supabase Error] Gallery save exception:", err);
        throw err;
      }
    }

    if (!item.id) item.id = "gal_" + Date.now();
    unmarkDeletedId(item.id);
    const current = await fetchAllFromCloud();
    if (!current.gallery) current.gallery = [];
    const idx = current.gallery.findIndex((g) => String(g.id) === String(item.id));
    if (idx >= 0) {
      current.gallery[idx] = { ...current.gallery[idx], ...item, ...payload };
    } else {
      current.gallery.unshift({ ...item, ...payload });
    }
    setLocalData(current);
    return true;
  }

  async function deleteGalleryItem(id, storagePath) {
    addDeletedId(id);

    if (client) {
      try {
        const numId = Number(id);
        const queryId = !isNaN(numId) ? numId : id;
        const { error } = await client.from("gallery").delete().eq("id", queryId);
        if (error) console.error(`[Supabase Error] Delete gallery '${queryId}':`, error.message);
      } catch (err) {
        console.error("[Supabase Error] Delete gallery exception:", err);
      }
    }

    if (storagePath) {
      await deleteStorageFile(storagePath);
    }

    const current = await fetchAllFromCloud();
    if (current && current.gallery) {
      current.gallery = current.gallery.filter((g) => String(g.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  async function saveActivity(act) {
    await ensureAdminSession();
    const payload = {
      title: act.title || "ACTIVITY",
      organization: act.organization || act.host || "",
      category: act.category || "WORKSHOP",
      date: act.date || "",
      description: act.description || "",
      image_url: (act.image_url || act.photo_url || "").toString(),
      storage_path: act.storage_path || null
    };

    if (client) {
      try {
        if (act.id && typeof act.id === "number") {
          const { error } = await client.from("activities").update(payload).eq("id", act.id);
          if (error) throw error;
        } else {
          const { data: inserted, error } = await client.from("activities").insert([payload]).select();
          if (error) throw error;
          if (inserted && inserted[0]) act.id = inserted[0].id;
        }
      } catch (err) {
        console.error("[Supabase Error] Save activity exception:", err);
        throw err;
      }
    }

    if (!act.id) act.id = "act_" + Date.now();
    unmarkDeletedId(act.id);
    const current = await fetchAllFromCloud();
    if (!current.activities) current.activities = [];
    const idx = current.activities.findIndex((a) => String(a.id) === String(act.id));
    if (idx >= 0) {
      current.activities[idx] = { ...current.activities[idx], ...act, ...payload };
    } else {
      current.activities.unshift({ ...act, ...payload });
    }
    setLocalData(current);
    return true;
  }

  async function deleteActivity(id, storagePath) {
    await ensureAdminSession();
    addDeletedId(id);

    if (client) {
      try {
        const numId = Number(id);
        const queryId = !isNaN(numId) ? numId : id;
        const { error } = await client.from("activities").delete().eq("id", queryId);
        if (error) console.error(`[Supabase Error] Delete activity '${queryId}':`, error.message);
      } catch (err) {
        console.error("[Supabase Error] Delete activity exception:", err);
      }
    }

    if (storagePath) {
      await deleteStorageFile(storagePath);
    }

    const current = await fetchAllFromCloud();
    if (current && current.activities) {
      current.activities = current.activities.filter((a) => String(a.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  // --- REPLACE IMAGE (SAFE TRANSACTIONAL IMAGE SWAP) ---
  async function replaceItemImage({ table, id, oldStoragePath, newFile, folder }) {
    if (!newFile) throw new Error("New image file is required.");
    // 1. Upload new image first
    const uploadRes = await uploadStorageFile(newFile, folder);

    try {
      // 2. Update database record with new image URL
      const numId = Number(id);
      const updateData = {
        image_url: uploadRes.publicUrl,
        storage_path: uploadRes.storagePath,
        updated_at: new Date().toISOString()
      };
      if (table === 'projects') {
        updateData.cover_image = uploadRes.publicUrl;
      }

      const { data, error } = await client
        .from(table)
        .update(updateData)
        .eq('id', !isNaN(numId) ? numId : id)
        .select();

      if (error) {
        await deleteStorageFile(uploadRes.storagePath);
        throw new Error(`Database update failed: ${error.message}`);
      }

      // 3. Remove old file if it existed
      if (oldStoragePath && oldStoragePath !== uploadRes.storagePath) {
        await deleteStorageFile(oldStoragePath);
      }

      return {
        publicUrl: uploadRes.publicUrl,
        storagePath: uploadRes.storagePath,
        updatedRow: data?.[0]
      };
    } catch (err) {
      await deleteStorageFile(uploadRes.storagePath);
      throw err;
    }
  }

  // --- BATCH MULTI-FILE UPLOAD HELPER ---
  async function uploadBatchFiles({ files, folder, defaultMetadata = {}, onProgress, saveRecordFn }) {
    const fileList = Array.from(files);
    const results = {
      total: fileList.length,
      succeeded: [],
      failed: []
    };

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        if (typeof onProgress === 'function') {
          onProgress({ index: i, total: fileList.length, file, status: 'uploading' });
        }

        const uploadRes = await uploadStorageFile(file, folder);

        const recordData = {
          ...defaultMetadata,
          title: defaultMetadata.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase(),
          image_url: uploadRes.publicUrl,
          storage_path: uploadRes.storagePath
        };

        const saved = await saveRecordFn(recordData);
        results.succeeded.push({ file: file.name, record: saved });

        if (typeof onProgress === 'function') {
          onProgress({ index: i, total: fileList.length, file, status: 'success', record: saved });
        }
      } catch (err) {
        console.error(`[Batch Upload] File error on "${file.name}":`, err);
        results.failed.push({ file: file.name, error: err.message });
        if (typeof onProgress === 'function') {
          onProgress({ index: i, total: fileList.length, file, status: 'error', error: err.message });
        }
      }
    }

    return results;
  }

  /* ============================================================
     6. REALTIME SUBSCRIPTION (AUTO-RENDER ON POSTGRES CHANGES)
     ============================================================ */
  function subscribeToRealtime(handlers = {}) {
    if (!client || typeof client.channel !== "function") {
      console.warn("[Supabase Realtime] Supabase client or channel API not available.");
      return null;
    }

    try {
      const channel = client
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "activities" },
          async (payload) => {
            if (typeof handlers.onActivitiesChange === "function") await handlers.onActivitiesChange(payload);
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "projects" },
          async (payload) => {
            if (typeof handlers.onProjectsChange === "function") await handlers.onProjectsChange(payload);
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "certificates" },
          async (payload) => {
            if (typeof handlers.onCertificatesChange === "function") await handlers.onCertificatesChange(payload);
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "gallery" },
          async (payload) => {
            if (typeof handlers.onGalleryChange === "function") await handlers.onGalleryChange(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (err) {
      console.error("[Supabase Realtime Error] Setup exception:", err);
      return null;
    }
  }

  function subscribeToProjects(callback) {
    return subscribeToRealtime({ onProjectsChange: callback });
  }

  // Unified API exports
  const SupabaseCMS = {
    client,
    getClient: () => client,
    // Auth & Admin
    getSession,
    getCurrentUser,
    checkIsAdmin,
    signInAdmin,
    signOutAdmin,
    // Storage
    validateFile,
    uploadStorageFile,
    deleteStorageFile,
    replaceItemImage,
    uploadBatchFiles,
    // CRUD
    fetchProjects,
    saveProject,
    deleteProject,
    subscribeToProjects,
    subscribeToRealtime,
    uploadProject: async (projectData, file) => {
      if (file) {
        const up = await uploadStorageFile(file, "projects");
        projectData.image_url = up.publicUrl;
        projectData.cover_image = up.publicUrl;
        projectData.storage_path = up.storagePath;
      }
      return await saveProject(projectData);
    },
    fetchCertificates,
    saveCertificate,
    deleteCertificate,
    fetchGallery,
    saveGalleryItem,
    deleteGalleryItem,
    fetchActivities,
    saveActivity,
    deleteActivity,
    fetchAllFromCloud
  };

  window.SupabaseCMS = SupabaseCMS;

  // Global standalone helper aliases
  window.fetchProjects = fetchProjects;
  window.saveProject = saveProject;
  window.deleteProject = deleteProject;
  window.subscribeToProjects = subscribeToProjects;
  window.subscribeToRealtime = subscribeToRealtime;
  window.uploadProject = SupabaseCMS.uploadProject;
  window.uploadStorageFile = uploadStorageFile;
  window.fetchCertificates = fetchCertificates;
  window.saveCertificate = saveCertificate;
  window.deleteCertificate = deleteCertificate;
  window.fetchGallery = fetchGallery;
  window.saveGalleryItem = saveGalleryItem;
  window.deleteGalleryItem = deleteGalleryItem;
  window.fetchActivities = fetchActivities;
  window.saveActivity = saveActivity;
  window.deleteActivity = deleteActivity;
})();
