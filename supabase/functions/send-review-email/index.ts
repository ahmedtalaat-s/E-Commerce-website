import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer";

serve(async (req) => {
  try {
    const { email, productName, productId } = await req.json();

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Deno.env.get("GMAIL_USER"), // Your Gmail address
        pass: Deno.env.get("GMAIL_PASS")  // App password if 2FA enabled
      }
    });

    // Send the email
    await transporter.sendMail({
      from: `"Design Craft" <${Deno.env.get("GMAIL_USER")}>`,
      to: email,
      subject: `Review your purchase: ${productName}`,
      html: `
        <p>We hope you're enjoying <b>${productName}</b>!</p>
        <p>Please take a moment to leave us a review:</p>
        <a href="http://localhost:4200/product//${productId}" style="color:blue;">Leave a Review</a>
      `
    });

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
