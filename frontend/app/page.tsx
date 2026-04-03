"use client";

import { useEffect, useState } from "react";

function timeAgo(dateString: string) {
  if (!dateString) return "Baru saja";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
}

export default function LiveBlogFeed() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  const fetchBlogs = () => {
    fetch("http://127.0.0.1:8000/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBlogs();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(`${now.getHours()}.${now.getMinutes()}.${now.getSeconds()}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalBlogs = blogs.length;
  const uniqueAuthors = new Set(blogs.map((b) => b.author_nim)).size;
  const latestBlog = blogs.length > 0 ? blogs[blogs.length - 1] : null;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div>
            <div style={styles.headerTitleWrap}>
              <span style={styles.headerIcon}></span>
              <h1 style={styles.headerTitle}>Live Blog Feed</h1>
            </div>
            <p style={styles.headerSubtitle}>
              Modul Praktikum Mahasiswa - Real-time Updates
            </p>
          </div>
          <div style={styles.liveIndicator}>
            <div style={styles.liveDot}></div>
            LIVE
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div>
              <p style={styles.statLabel}>Total Blogs</p>
              <h2 style={styles.statValue}>{totalBlogs}</h2>
            </div>
            <div style={{ ...styles.statIconBox }}></div>
          </div>

          <div style={styles.statCard}>
            <div>
              <p style={styles.statLabel}>Active Authors</p>
              <h2 style={{ ...styles.statValue, color: "#10b981" }}>
                {uniqueAuthors}
              </h2>
            </div>
            <div style={{ ...styles.statIconBox }}></div>
          </div>

          <div style={styles.statCard}>
            <div>
              <p style={styles.statLabel}>Last Update</p>
              <h2 style={styles.statValue}>{currentTime}</h2>
            </div>
            <div style={{ ...styles.statIconBox }}></div>
          </div>
        </div>

        {latestBlog && (
          <div style={styles.notificationBar}>
            <div style={styles.notificationLeft}>
              <span></span>
              <span>
                NIM <strong>{latestBlog.author_nim}</strong> memperbarui blog: "{latestBlog.judul}"
              </span>
            </div>
            <span style={styles.notificationTime}>{currentTime}</span>
          </div>
        )}

        <div style={styles.grid}>
          {blogs.map((blog, index) => (
            <div key={blog.id || index} style={styles.blogCard}>
              <div style={styles.cardHeader}>{blog.judul}</div>
              <div style={styles.cardBody}>
                <p style={styles.cardContent}>{blog.isi}</p>

                <div style={styles.cardFooter}>
                  <div style={styles.authorInfo}>
                    <div style={styles.avatar}>
                      {blog.author_nama
                        ? blog.author_nama.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <p style={styles.authorName}>
                        {blog.author_nama || "Unknown"}
                      </p>
                      <p style={styles.authorNim}>
                        NIM: {blog.author_nim || "-"}
                      </p>
                    </div>
                  </div>

                  <div style={styles.classTag}>
                    {blog.author_kelas || "N/A"}
                  </div>
                </div>

                <div style={styles.timestamp}>
                  {timeAgo(blog.updated_at || blog.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#eef2f6",
    padding: "32px 24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  headerCard: {
    backgroundColor: "#ffffff",
    padding: "24px 32px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  headerTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  headerIcon: {
    fontSize: "28px",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#6d28d9",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#10b981",
    fontWeight: "bold",
    fontSize: "14px",
    letterSpacing: "0.5px",
  },
  liveDot: {
    width: "10px",
    height: "10px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
  },
  statsRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "24px",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "20px 24px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 8px 0",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#8b5cf6",
    margin: 0,
  },
  statIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
  },
  notificationBar: {
    backgroundColor: "#f0fdf4",
    borderLeft: "4px solid #10b981",
    padding: "16px 24px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    color: "#374151",
    fontSize: "14px",
  },
  notificationLeft: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  notificationTime: {
    color: "#9ca3af",
    fontSize: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },
  blogCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column" as const,
  },
  cardHeader: {
    backgroundColor: "#8b5cf6",
    color: "#ffffff",
    padding: "16px 24px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  cardBody: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    flex: 1,
  },
  cardContent: {
    fontSize: "14px",
    color: "#4b5563",
    margin: 0,
    minHeight: "40px",
    lineHeight: "1.5",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f3f4f6",
    paddingTop: "16px",
  },
  authorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "14px",
  },
  authorName: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  authorNim: {
    margin: 0,
    fontSize: "11px",
    color: "#6b7280",
  },
  classTag: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    padding: "4px 10px",
    borderRadius: "16px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: "11px",
    color: "#9ca3af",
  },
};