import React from "react";

const Welcome = () => {
  const stats = [
    { label: "Patients", value: 128 },
    { label: "Appointments", value: 56 },
    { label: "Wellness Services", value: 24 },
    { label: "Providers", value: 12 },
  ];

  const features = [
    "Manage patient records efficiently",
    "Schedule and track appointments",
    "Monitor wellness program progress",
    "Generate insightful reports",
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#fff",
      background: "linear-gradient(135deg, #1a1a1a, #222)",
      padding: "2rem",
    },
    hero: {
      textAlign: "center",
      padding: "4rem 1rem 3rem",
      background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0))",
      borderRadius: "20px",
      marginBottom: "3rem",
    },
    heading: {
      fontSize: "3rem",
      fontWeight: 700,
      marginBottom: "1rem",
      color: "#ffd700",
      textShadow: "0 0 10px rgba(255,215,0,0.7)",
    },
    subtitle: {
      fontSize: "1.3rem",
      color: "#f1e0a8",
      maxWidth: "700px",
      margin: "0 auto 2rem",
    },
    statsContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "1.5rem",
      marginTop: "2rem",
    },
    statCard: {
      background: "rgba(34,34,34,0.7)",
      border: "1px solid rgba(255,215,0,0.5)",
      borderRadius: "16px",
      padding: "1.5rem 2rem",
      minWidth: "150px",
      boxShadow: "0 6px 20px rgba(255,215,0,0.3)",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "default",
    },
    statCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 28px rgba(255,215,0,0.5)",
    },
    statLabel: {
      fontSize: "1rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
      color: "#ffd700",
    },
    statValue: {
      fontSize: "1.8rem",
      fontWeight: 700,
      color: "#fff",
      textShadow: "0 0 6px rgba(255,215,0,0.5)",
    },
    section: {
      marginBottom: "3rem",
      padding: "2rem",
      borderRadius: "20px",
      background: "rgba(255,215,0,0.05)",
    },
    sectionHeading: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "1rem",
      color: "#ffd700",
      textShadow: "0 0 6px rgba(255,215,0,0.4)",
    },
    sectionText: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      color: "#f0e5b3",
    },
    featureList: {
      listStyle: "disc",
      paddingLeft: "1.5rem",
      color: "#fff3b0",
      marginTop: "1rem",
    },
  };

  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heading}>Welcome to MyApp</h1>
        <p style={styles.subtitle}>
          Your central dashboard for managing patients, appointments, wellness services, and more.
        </p>

        <div style={styles.statsContainer}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                ...styles.statCard,
                ...(hovered === idx ? styles.statCardHover : {}),
              }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>About Us</h2>
        <p style={styles.sectionText}>
          MyApp is designed to simplify healthcare management. Our platform empowers clinics, wellness providers, and administrators to monitor patients’ progress, manage appointments efficiently, and provide top-quality care.
        </p>
      </div>

      {/* Features Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>Features</h2>
        <ul style={styles.featureList}>
          {features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <button
          style={{
            padding: "16px 32px",
            fontSize: "1.2rem",
            fontWeight: 700,
            borderRadius: "30px",
            border: "none",
            background: "linear-gradient(135deg, #ffd700 0%, #ffb400 100%)",
            color: "#1a1a1a",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(255,215,0,0.4)",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 10px 28px rgba(255,215,0,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,215,0,0.4)";
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
