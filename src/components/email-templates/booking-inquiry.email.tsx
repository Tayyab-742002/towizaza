import * as React from "react";

interface BookingInquiryEmailProps {
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  eventDetails: string;
}

export const BookingInquiryEmail: React.FC<BookingInquiryEmailProps> = ({
  name,
  email,
  eventType,
  eventDate,
  eventDetails,
}) => {
  // Theme colors
  const colors = {
    primary: "#E63946",
    secondary: "#6A0DAD",
    accent: "#4361EE",
    dark: "#121212",
    mid: "#717171",
    light: "#F8F9FA",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Arial', sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        color: colors.dark,
        backgroundColor: colors.light,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "30px 20px",
          backgroundColor: colors.dark,
          textAlign: "center",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            color: colors.light,
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          TOWIZAZA
        </div>
        <div
          style={{
            width: 50,
            height: 2,
            backgroundColor: colors.primary,
            margin: "0 auto 10px",
          }}
        ></div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            fontStyle: "italic",
            color: colors.light,
          }}
        >
          New Booking Inquiry
        </div>
      </div>

      {/* Banner */}
      <div
        style={{
          backgroundColor: colors.primary,
          color: colors.light,
          padding: "15px 20px",
          textAlign: "center",
          fontFamily: "'Montserrat', 'Arial', sans-serif",
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        Booking Inquiry Received
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px 30px" }}>
        <h2
          style={{
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            fontSize: 18,
            color: colors.dark,
            marginBottom: 15,
            paddingBottom: 10,
            borderBottom: `2px solid ${colors.primary}`,
          }}
        >
          Inquiry Details
        </h2>
        <table style={{ width: "100%", marginBottom: 20, fontSize: 15 }}>
          <tbody>
            <tr>
              <td
                style={{ fontWeight: 600, color: colors.mid, padding: "8px 0" }}
              >
                Name:
              </td>
              <td style={{ color: colors.dark }}>{name}</td>
            </tr>
            <tr>
              <td
                style={{ fontWeight: 600, color: colors.mid, padding: "8px 0" }}
              >
                Email:
              </td>
              <td style={{ color: colors.dark }}>{email}</td>
            </tr>
            <tr>
              <td
                style={{ fontWeight: 600, color: colors.mid, padding: "8px 0" }}
              >
                Event Type:
              </td>
              <td style={{ color: colors.dark }}>{eventType}</td>
            </tr>
            <tr>
              <td
                style={{ fontWeight: 600, color: colors.mid, padding: "8px 0" }}
              >
                Event Date:
              </td>
              <td style={{ color: colors.dark }}>{eventDate}</td>
            </tr>
          </tbody>
        </table>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              color: colors.secondary,
              fontFamily: "'Montserrat', 'Arial', sans-serif",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Event Details
          </h3>
          <div style={{ color: colors.dark, fontSize: 15, lineHeight: 1.6 }}>
            {eventDetails}
          </div>
        </div>
        <div style={{ color: colors.mid, fontSize: 14, marginTop: 20 }}>
          Please reply to this email to follow up with the inquirer.
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "25px 30px",
          backgroundColor: colors.dark,
          color: colors.light,
          textAlign: "center",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <p style={{ margin: "0 0 10px", fontSize: 14 }}>TOWIZAZA</p>
        <div
          style={{
            width: 40,
            height: 2,
            backgroundColor: colors.primary,
            margin: "0 auto 10px",
          }}
        ></div>
        <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
          This message was sent from the booking inquiry form on your website.
        </p>
      </div>
    </div>
  );
};

export default BookingInquiryEmail;
