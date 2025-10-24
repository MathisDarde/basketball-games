import React from "react";

interface ResetPasswordEmailProps {
  user: {
    name?: string;
    email: string;
  };
  resetUrl: string;
}

export default function ResetPasswordEmail({
  user,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f2f4f6",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ padding: "20px 0" }}
        >
          <tr>
            <td align="center">
              <table
                width="600"
                style={{
                  background: "#fff7ea",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      padding: "24px 28px 12px 28px",
                      textAlign: "left",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        color: "#6b2f4f",
                        fontFamily: "Arial, sans-serif",
                        textTransform: "uppercase",
                      }}
                    >
                      Reset your password
                    </h1>
                  </td>
                </tr>

                {/* Greeting */}
                <tr>
                  <td style={{ padding: "0 28px 8px 28px" }}>
                    <p
                      style={{ margin: 0, fontSize: "16px", color: "#374151" }}
                    >
                      Hi{" "}
                      <strong style={{ color: "#111827" }}>{user.name}</strong>,
                    </p>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "12px 28px 18px 28px" }}>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#4b5563",
                        lineHeight: 1.5,
                        fontSize: "15px",
                      }}
                    >
                      We have received a request to reset the password for your
                      account. Click the button below to set a new password :
                    </p>

                    <table style={{ margin: "18px 0" }}>
                      <tr>
                        <td align="left">
                          <a
                            href={resetUrl}
                            target="_blank"
                            style={{
                              display: "inline-block",
                              padding: "12px 20px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              fontWeight: 600,
                              fontSize: "15px",
                              background: "#6b2f4f",
                              color: "#ffffff",
                            }}
                          >
                            Reset my password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#6b7280",
                        fontSize: "13px",
                        lineHeight: 1.4,
                      }}
                    >
                      If the button doesn&apos;t work, please copy and paste the
                      following link directly into your browser :
                    </p>
                    <p
                      style={{
                        wordBreak: "break-all",
                        margin: "0 0 18px 0",
                        fontSize: "13px",
                        color: "#1f2937",
                      }}
                    >
                      <a
                        href={resetUrl}
                        target="_blank"
                        style={{
                          color: "#6b2f4f",
                          textDecoration: "underline",
                        }}
                      >
                        {resetUrl}
                      </a>
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: "18px 28px 24px 28px",
                      borderTop: "1px solid #eef2f7",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "13px",
                        lineHeight: 1.4,
                      }}
                    >
                      Need some help ? Write us :{" "}
                      <a
                        href={`mailto:basketballgames@gmail.com`}
                        style={{
                          color: "#6b2f4f",
                          textDecoration: "underline",
                        }}
                      >
                        basketballgames@gmail.com
                      </a>
                    </p>

                    <p
                      style={{
                        margin: "12px 0 0 0",
                        color: "#9ca3af",
                        fontSize: "12px",
                      }}
                    >
                      Support team, BasketballGames
                      <br />
                      &copy; {new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
