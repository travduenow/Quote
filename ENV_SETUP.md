# Environment Variables Setup

## Required Configuration

To make the quote calculator fully functional, you need to configure the following environment variable:

### NEXT_PUBLIC_FORMSPREE_URL

This is the form submission endpoint for collecting quotes and booking requests.

**Steps to set it up:**

1. **Create a Formspree Account**: Visit [formspree.io](https://formspree.io) and sign up for a free account
2. **Create a New Form**: Create a new form in your Formspree dashboard
3. **Get Your Form Endpoint**: Copy the form endpoint URL (format: `https://formspree.io/f/YOUR_FORM_ID`)
4. **Add Environment Variable**: Create a `.env.local` file in the project root and add:
   ```
   NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/YOUR_FORM_ID
   ```

### Alternative: Use in Vercel Dashboard

If deploying to Vercel, add the variable in your project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add a new variable:
   - Name: `NEXT_PUBLIC_FORMSPREE_URL`
   - Value: `https://formspree.io/f/YOUR_FORM_ID`
   - Environments: **All** (Production, Preview, Development)
4. Redeploy your project for changes to take effect

## Form Features

The form automatically collects:
- Customer name, email, phone, and address
- Selected lot size and pricing information
- Payment method and total quote
- How the customer heard about True North
- Preferred contact method
- Additional notes about their property

All submissions are sent directly to your Formspree inbox.
