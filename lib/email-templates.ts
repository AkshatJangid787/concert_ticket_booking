export function generateTicketEmailHtml(ticket: any, user: any, show: any) {
    const date = new Date(show.showDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = new Date(show.showDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Ticket - Ashish Soni Live</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Courier New', monospace;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
            
            <!-- Branding -->
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Ashish Soni</h1>
                <p style="margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 4px; color: #666;">Live in Concert</p>
            </div>

            <!-- Confirmation Message -->
            <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="font-size: 48px; font-weight: 900; line-height: 1; text-transform: uppercase; margin: 0;">Access<br>Confirmed</h2>
                <div style="width: 60px; height: 6px; background-color: #000; margin: 20px auto;"></div>
                <p style="font-size: 16px; margin: 0;">You are strictly authorized.</p>
            </div>

            <!-- Ticket -->
            <div style="border: 4px solid #000; padding: 0; margin-bottom: 40px; position: relative; background: #fff;">
                <!-- Ticket Header -->
                <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
                    <h3 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">${show.title}</h3>
                </div>

                <!-- Ticket Body -->
                <div style="padding: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                            <td style="padding-bottom: 20px;">
                                <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666;">Date</p>
                                <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">${date}</p>
                            </td>
                            <td style="padding-bottom: 20px; text-align: right;">
                                <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666;">Time</p>
                                <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">${time}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666;">Venue</p>
                                <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">Main Arena / Digital</p>
                            </td>
                             <td style="text-align: right;">
                                <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666;">Seats</p>
                                <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">General Admission</p>
                            </td>
                        </tr>
                    </table>

                    <!-- Digital ID / Code -->
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border: 2px dashed #ccc;">
                        <p style="margin: 0 0 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #666;">Ticket ID</p>
                        <p style="margin: 0; font-family: monospace; font-size: 24px; letter-spacing: 4px; font-weight: bold;">${ticket.id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                <!-- Ticket Footer -->
                <div style="border-top: 4px solid #000; padding: 15px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; font-weight: bold;">Attendee: ${user.name}</p>
                </div>
            </div>

            <!-- Additional Info -->
            <div style="text-align: center; color: #666; font-size: 12px; line-height: 1.6;">
                <p>Present this email at the entrance.</p>
                <p>Total Paid: Rs. ${show.price}</p>
                <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} Ashish Soni Live. All rights reserved.</p>
            </div>
            
        </div>
    </body>
    </html>
    `;
}

export function generateVerificationEmailHtml(otp: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Identity - Ashish Soni Live</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Courier New', monospace;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px; border: 2px solid black;">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Ashish Soni</h1>
            </div>

            <div style="text-align: center;">
                <h2 style="font-size: 20px; text-transform: uppercase; margin-bottom: 20px;">Verify Identity</h2>
                <p style="margin-bottom: 10px; color: #666;">Your Access Code is:</p>
                <div style="background: #eee; padding: 15px; display: inline-block; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 32px; letter-spacing: 5px; font-weight: bold;">${otp}</h3>
                </div>
                <p style="margin: 0; font-size: 12px; color: #999;">Code expires in 10 minutes.</p>
            </div>
            
        </div>
    </body>
    </html>
    `;
}
