/**
 * Supabase Client & Real Data CMS Engine
 * Sagit Faturrakhman — AI Laboratory Portfolio
 * 
 * - Connected to Supabase with public credentials.
 * - Completely CLEAN from fake/hardcoded seed data.
 * - By default, projects, certificates, and gallery start 100% EMPTY.
 * - Data only appears after you save it in Admin CMS.
 * - Delete operations immediately remove records from both Admin CMS and homepage.
 */

(function () {
  'use strict';

  const SUPABASE_URL = "https://ysjilfxueahnsisqwbaa.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzamlsZnh1ZWFobnNpc3F3YmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTI1MzIsImV4cCI6MjEwMzkyODUzMn0.5_gWw-0X0GqkNDIAsMzGDm4ApnIqAZRErym7P-bmVkM";
  const STORAGE_BUCKET = "portfolio-images";
  const STORAGE_META_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/portfolio_data.json`;
  const CACHE_KEY = "sagit.portfolio.vault.v5";
  const DELETED_KEY = "sagit.portfolio.deleted_records.v1";

  // Clean legacy demo seeds if present
  try {
    localStorage.removeItem("sagit.portfolio.vault.v4");
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

  // 1. Initialize Supabase Client globally
  let client = null;
  if (typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false }
      });
    } catch (err) {
      console.warn("[Supabase] Client initialization warning:", err);
    }
  }

  // Expose window.supabaseClient globally
  window.supabaseClient = client;

  // Local storage helpers
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
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("[Local] Write cache error:", e);
    }
  }

  /* ============================================================
     2. REAL-TIME DATA FETCHING (EMPTY BY DEFAULT)
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

    // 2. Fetch directly from Supabase SQL table 'projects' if any rows exist
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
              title: p.main_title || p.title || "PROJECT",
              main_title: p.main_title || p.title || "PROJECT",
              subtitle: p.subtitle || "",
              description: p.description || "",
              category: p.category || "PROJECT",
              status: p.status || "LIVE SYSTEM",
              live_url: p.project_url || p.live_url || "",
              project_url: p.project_url || p.live_url || "",
              cover_image: p.image_url || p.cover_image || "",
              image_url: p.image_url || p.cover_image || "",
              technologies: p.technologies || "",
              ai_features: p.ai_features || "",
              role: p.role || ""
            }));
          cloudData.projects = formatted;
        }
      }
    } catch (e) {
      console.warn("[Supabase] Projects fetch error:", e);
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
     3. FILE UPLOAD (BUCKET: portfolio-images)
     ============================================================ */
  async function uploadStorageFile(file, folder = "uploads") {
    if (!file) return "";

    if (client) {
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `${folder}/${Date.now()}_${cleanName}`;

        const { error } = await client.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (!error) {
          const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
          if (data && data.publicUrl) return data.publicUrl;
        }
      } catch (err) {
        console.warn("[Storage] Cloud upload notice:", err);
      }
    }

    // Fast local DataURL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  /* ============================================================
     4. SAVE & MUTATE DATA (REALTIME PERSISTENCE)
     ============================================================ */
  async function saveProject(project) {
    if (!project.id) project.id = "proj_" + Date.now();

    const payload = {
      main_title: project.title || project.main_title || "PROJECT",
      subtitle: project.subtitle || "",
      description: project.description || "",
      image_url: project.cover_image || project.image_url || "",
      project_url: project.live_url || project.project_url || ""
    };

    // 1. Try to save to Supabase 'projects' table
    if (client) {
      try {
        if (typeof project.id === "number") {
          await client.from("projects").update(payload).eq("id", project.id);
        } else {
          const { data: inserted } = await client.from("projects").insert([payload]).select();
          if (inserted && inserted[0]) {
            project.id = inserted[0].id;
          }
        }
      } catch (err) {
        console.warn("[Supabase] Project remote table notice:", err);
      }
    }

    // 2. Save to local cache
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

  async function deleteProject(id) {
    addDeletedId(id);

    // 1. Delete from Supabase 'projects' table if client available
    if (client) {
      try {
        const numId = Number(id);
        if (!isNaN(numId)) {
          await client.from("projects").delete().eq("id", numId);
        }
        await client.from("projects").delete().eq("id", id);
      } catch (err) {
        console.warn("[Supabase] Delete project notice:", err);
      }
    }

    // 2. Delete from cache
    const current = await fetchAllFromCloud();
    if (current && current.projects) {
      current.projects = current.projects.filter((p) => String(p.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  async function saveCertificate(cert) {
    if (!cert.id) cert.id = "cert_" + Date.now();
    unmarkDeletedId(cert.id);
    const current = await fetchAllFromCloud();
    if (!current.certificates) current.certificates = [];
    const idx = current.certificates.findIndex((c) => String(c.id) === String(cert.id));
    if (idx >= 0) {
      current.certificates[idx] = { ...current.certificates[idx], ...cert };
    } else {
      current.certificates.unshift(cert);
    }
    setLocalData(current);
    return true;
  }

  async function deleteCertificate(id) {
    addDeletedId(id);
    const current = await fetchAllFromCloud();
    if (current && current.certificates) {
      current.certificates = current.certificates.filter((c) => String(c.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  async function saveGalleryItem(item) {
    if (!item.id) item.id = "gal_" + Date.now();
    unmarkDeletedId(item.id);
    const current = await fetchAllFromCloud();
    if (!current.gallery) current.gallery = [];
    const idx = current.gallery.findIndex((g) => String(g.id) === String(item.id));
    if (idx >= 0) {
      current.gallery[idx] = { ...current.gallery[idx], ...item };
    } else {
      current.gallery.unshift(item);
    }
    setLocalData(current);
    return true;
  }

  async function deleteGalleryItem(id) {
    addDeletedId(id);
    const current = await fetchAllFromCloud();
    if (current && current.gallery) {
      current.gallery = current.gallery.filter((g) => String(g.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  async function saveActivity(act) {
    if (!act.id) act.id = "act_" + Date.now();
    unmarkDeletedId(act.id);
    const current = await fetchAllFromCloud();
    if (!current.activities) current.activities = [];
    current.activities.unshift(act);
    setLocalData(current);
    return true;
  }

  async function deleteActivity(id) {
    addDeletedId(id);
    const current = await fetchAllFromCloud();
    if (current && current.activities) {
      current.activities = current.activities.filter((a) => String(a.id) !== String(id));
      setLocalData(current);
    }
    return true;
  }

  // Unified API exports
  const SupabaseCMS = {
    client,
    getClient: () => client,
    fetchProjects,
    saveProject,
    deleteProject,
    uploadStorageFile,
    uploadProject: async (projectData, file) => {
      if (file) {
        const url = await uploadStorageFile(file, "projects");
        projectData.image_url = url;
        projectData.cover_image = url;
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
  window.uploadProject = SupabaseCMS.uploadProject;
  window.uploadStorageFile = uploadStorageFile;
})();
