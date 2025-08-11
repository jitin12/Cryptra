import 'dotenv/config';

import cron from "node-cron";
import mongoose from "mongoose";
import Alert from "./models/schema";
import connectDB from "./connectdb";
import { Resend } from "resend";
import { fetchPrice } from "./fetchprice";

const resend = new Resend(process.env.RESEND_API_KEY);

async function bgjob() {
    const alerts = await Alert.find({ isTriggered: false });
    console.log(`Checking ${alerts.length} alerts...`);

    for (const alert of alerts) {
        try {
            const priceStr = await fetchPrice(alert.symbol);
            const currprice = parseFloat(priceStr);

            console.log(`${alert.symbol} Price: $${currprice}`);

            const shouldTrigger =
                (alert.direction === "below" && currprice < alert.targetPrice
                ) ||
                (alert.direction === "above" && currprice > alert.targetPrice
                );
            console.log(shouldTrigger);
            if (shouldTrigger) {
                await resend.emails.send({
                    from: "onboarding@resend.dev",
                    to: "jitinkukreja00@gmail.com",
                    subject: "Cryptra Alert",
                    html: `<p>${alert.symbol} price crossed your target of $${alert.targetPrice} — Current: $${currprice}</p>`,
                });

                alert.isTriggered = true;
                await alert.save();

                console.log(`📧 Email sent for ${alert.symbol}`);
            }
        } catch (err) {
            console.error(`Error processing alert for ${alert.symbol}:`, err);
        }
    }
}

(async () => {
    try {
        await connectDB();
        console.log('✅ MongoDB connected');

        
        cron.schedule("* * * * *", async () => {
            console.log("⏳ Running background price check...");
            await bgjob();
        });
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err);
        process.exit(1); 
    }
})();
