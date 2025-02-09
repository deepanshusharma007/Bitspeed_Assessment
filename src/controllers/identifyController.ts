import { Request, Response } from 'express';
import pool from '../database';

// export const identifyContact = async (req: Request, res: Response): Promise<void> => {
//     const { email, phoneNumber } = req.body;

//     if (!email && !phoneNumber) {
//         res.status(400).json({ error: "Either email or phoneNumber is required" });
//         return;
//     }

//     try {
//         // ✅ Fetch all contacts matching either email or phoneNumber
//         const [existingContacts]: any = await pool.query(
//             `SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?`,
//             [email, phoneNumber]
//         );

//         let contacts = existingContacts as any[];

//         if (contacts.length === 0) {
//             // ✅ No existing contact, create a new primary contact
//             const [result]: any = await pool.query(
//                 `INSERT INTO Contact (email, phoneNumber, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, 'primary', NOW(), NOW())`,
//                 [email, phoneNumber]
//             );

//             res.status(200).json({
//                 contact: {
//                     primaryContactId: result.insertId,
//                     emails: email ? [email] : [],
//                     phoneNumbers: phoneNumber ? [phoneNumber] : [],
//                     secondaryContactIds: []
//                 }
//             });
//             return;
//         }

//         // ✅ Determine the **oldest** primary contact
//         let primaryContact = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];

//         // ✅ Collect all related emails, phone numbers, and secondary contacts
//         let emails = new Set<string>();
//         let phoneNumbers = new Set<string>();
//         let secondaryContactIds = new Set<number>();

//         contacts.forEach(contact => {
//             if (contact.email) emails.add(contact.email);
//             if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
//             if (contact.id !== primaryContact.id) secondaryContactIds.add(contact.id);
//         });

//         // ✅ If the contact already exists (either email or phone number), don't insert a new one
//         const contactExists = contacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
//         if (!contactExists) {
//             // ✅ Insert only if no exact match exists
//             const [newContact]: any = await pool.query(
//                 `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, ?, 'secondary', NOW(), NOW())`,
//                 [email, phoneNumber, primaryContact.id]
//             );

//             secondaryContactIds.add(newContact.insertId);
//         }

//         // ✅ Update existing secondary contacts to ensure correct `linkedId`
//         await pool.query(
//             `UPDATE Contact SET linkedId = ?, linkPrecedence = 'secondary', updatedAt = NOW() WHERE linkedId IS NULL AND id <> ? AND (email = ? OR phoneNumber = ?)`,
//             [primaryContact.id, primaryContact.id, email, phoneNumber]
//         );

//         res.status(200).json({
//             contact: {
//                 primaryContactId: primaryContact.id,
//                 emails: Array.from(emails),
//                 phoneNumbers: Array.from(phoneNumbers),
//                 secondaryContactIds: Array.from(secondaryContactIds)
//             }
//         });

//     } catch (error) {
//         console.error("❌ Error identifying contact:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };





export const identifyContact = async (req: Request, res: Response): Promise<void> => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        res.status(400).json({ error: "Either email or phoneNumber is required" });
        return;
    }

    try {
        // Fetch contacts where email OR phoneNumber matches
        const [existingContacts]: any = await pool.query(
            `SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?`,
            [email, phoneNumber]
        );

        let contacts = existingContacts as any[];

        if (contacts.length === 0) {
            // No existing contact, create a new primary contact
            const [result]: any = await pool.query(
                `INSERT INTO Contact (email, phoneNumber, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, 'primary', NOW(), NOW())`,
                [email, phoneNumber]
            );

            res.status(200).json({
                contact: {
                    primaryContactId: result.insertId,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    secondaryContactIds: []
                }
            });
            return;
        }

        // Find all **existing** primary contacts
        let primaryContacts = contacts.filter(c => c.linkPrecedence === 'primary');

        // **🔴 Validation: If no primary contact exists, return an error**
        if (primaryContacts.length === 0) {
            res.status(400).json({ error: "Error! Preference is not primary" });
            return;
        }
        
        // ✅ Get the oldest primary contact (to merge all into this one)
        let primaryContact = primaryContacts.reduce((oldest, current) => {
            return new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current;
        });

        // ✅ Collect all linked data
        let emails = new Set<string>();
        let phoneNumbers = new Set<string>();
        let secondaryContactIds = new Set<number>();

        contacts.forEach(contact => {
            if (contact.email) emails.add(contact.email);
            if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
            if (contact.id !== primaryContact.id) secondaryContactIds.add(contact.id);
        });

        // ✅ If a new phone/email is introduced, create a secondary contact
        const emailExists = contacts.some(c => c.email === email);
        console.log(emailExists)
        const phoneExists = contacts.some(c => c.phoneNumber === phoneNumber);
        console.log(phoneExists)
        const isNewInfo = (!emailExists && email) || (!phoneExists && phoneNumber);

        if (isNewInfo) {
            const [newContact]: any = await pool.query(
                `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, ?, 'secondary', NOW(), NOW())`,
                [email, phoneNumber, primaryContact.id]
            );

            secondaryContactIds.add(newContact.insertId);
        }

        // ✅ **Fix: Run the update only if secondaryContactIds is not empty**
        if (secondaryContactIds.size > 0) {
            await pool.query(
                `UPDATE Contact SET linkedId = ?, linkPrecedence = 'secondary', updatedAt = NOW() WHERE linkedId IN (${Array.from(secondaryContactIds).join(',')}) OR id IN (${Array.from(secondaryContactIds).join(',')}) AND id <> ?`,
                [primaryContact.id, primaryContact.id]
            );
        }

        res.status(200).json({
            contact: {
                primaryContactId: primaryContact.id,
                emails: Array.from(emails),
                phoneNumbers: Array.from(phoneNumbers),
                secondaryContactIds: Array.from(secondaryContactIds)
            }
        });

    } catch (error) {
        console.error("❌ Error identifying contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
