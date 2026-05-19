const express = require('express');
const router = express.Router();
const { Article } = require('../models/Models');

// Seed articles if empty
const seedArticles = async () => {
  const count = await Article.countDocuments();
  if (count > 0) return;

  const articles = [
    {
      title: 'Understanding Blood Types: A Complete Guide',
      category: 'blood-health',
      excerpt: 'Learn about the ABO blood group system, Rh factor, and why compatibility matters in transfusions.',
      content: `Blood types are determined by the presence or absence of certain antigens on the surface of red blood cells. The ABO system classifies blood into four main types: A, B, AB, and O. Additionally, the Rh factor (positive or negative) further categorizes blood.

**Why Blood Type Matters**
Blood type compatibility is crucial for safe transfusions. Mismatched blood can trigger an immune response, causing serious complications. Type O negative is the universal donor, while AB positive is the universal recipient.

**The Rh Factor**
The Rh factor is a protein found on red blood cells. If you have it, you're Rh positive (+); if not, you're Rh negative (-). During pregnancy, Rh incompatibility between mother and child can cause complications.

**Blood Type and Health**
Research suggests blood type may influence susceptibility to certain diseases. Type O individuals have some natural protection against malaria, while type A may have higher risk for certain cancers.`,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
      readTime: 5,
      tags: ['blood type', 'health', 'science'],
    },
    {
      title: '10 Foods That Naturally Boost Your Blood Health',
      category: 'nutrition',
      excerpt: 'Discover the best foods to improve hemoglobin levels, strengthen red blood cells, and maintain optimal blood health.',
      content: `Maintaining healthy blood is essential for overall wellbeing. The right foods can significantly improve your blood quality and hemoglobin levels.

**Iron-Rich Foods**
Iron is essential for hemoglobin production. Include spinach, lentils, red meat, and fortified cereals in your diet. Pair with vitamin C to enhance absorption.

**Folate for Cell Production**
Leafy greens, beans, and citrus fruits are excellent sources of folate, which helps produce healthy red blood cells.

**Vitamin B12 Sources**
Eggs, dairy, and meat are rich in B12, crucial for nerve function and red blood cell formation. Vegans should consider supplementation.

**Beetroot: Nature's Blood Builder**
Beetroot is rich in iron, folate, and nitrates that improve blood flow and oxygen delivery. Add it to smoothies or salads regularly.`,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      readTime: 6,
      tags: ['nutrition', 'iron', 'hemoglobin', 'diet'],
    },
    {
      title: 'How Often Should You Donate Blood?',
      category: 'donation-tips',
      excerpt: 'Learn the safe intervals between donations, eligibility criteria, and how to prepare for your donation.',
      content: `Blood donation is one of the most selfless acts you can do. However, it's important to donate responsibly to protect your own health.

**Donation Frequency Guidelines**
- Whole blood: Every 56 days (8 weeks)
- Platelets: Every 7 days, up to 24 times per year
- Plasma: Every 28 days
- Double red cells: Every 112 days

**Eligibility Criteria**
Most healthy adults between 18-65 years weighing over 50kg can donate. You must be in good health and free from certain conditions or medications.

**Preparing to Donate**
Drink plenty of water beforehand, eat a healthy meal, avoid fatty foods, and get a good night's sleep. Wear comfortable clothing with sleeves that roll up easily.

**Post-Donation Care**
Rest for 10-15 minutes after donating, avoid strenuous activity for 24 hours, increase fluid intake, and consume iron-rich foods.`,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800',
      readTime: 4,
      tags: ['donation', 'health', 'eligibility'],
    },
    {
      title: 'The Importance of Staying Hydrated for Blood Health',
      category: 'lifestyle',
      excerpt: 'Discover how proper hydration directly impacts your blood volume, viscosity, and overall cardiovascular health.',
      content: `Water makes up about 55% of blood, playing a critical role in maintaining blood volume and enabling efficient nutrient transport throughout the body.

**Dehydration and Blood**
When dehydrated, blood becomes thicker and more viscous, making it harder for the heart to pump. This increases risk of blood clots, high blood pressure, and cardiovascular problems.

**How Much Water Do You Need?**
The general recommendation is 8 glasses (2 liters) daily, but active individuals, donors, and those in hot climates need more. Listen to your body's thirst signals.

**Signs of Poor Blood Hydration**
Dark urine, fatigue, dizziness, and headaches can all indicate inadequate hydration affecting blood composition.

**Best Drinks for Blood Health**
Besides water, coconut water, fruit-infused water, and herbal teas help maintain blood health. Pomegranate and beetroot juice specifically support blood formation.`,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f88?w=800',
      readTime: 4,
      tags: ['hydration', 'lifestyle', 'cardiovascular'],
    },
    {
      title: 'Blood Donation Myths Debunked',
      category: 'awareness',
      excerpt: 'We tackle the most common misconceptions about blood donation to help you make an informed decision.',
      content: `Many people avoid donating blood due to misconceptions. Let's set the record straight with science-backed facts.

**Myth 1: Donating Blood Is Painful**
Reality: You feel a brief pinch when the needle is inserted, but the process itself is painless. Most donors describe it as very comfortable.

**Myth 2: I'll Feel Weak After Donating**
Reality: Your body replaces the donated blood volume within 24-48 hours. Plasma is replaced within hours. Most donors feel completely normal within a day.

**Myth 3: I Can't Donate if I Have Tattoos**
Reality: In most countries, you can donate 3-6 months after getting a tattoo from a licensed parlor using sterile equipment.

**Myth 4: Vegetarians Can't Donate**
Reality: Vegetarians can absolutely donate blood! Diet does not affect eligibility as long as hemoglobin levels are adequate.

**Myth 5: One Donation Doesn't Make a Difference**
Reality: A single donation can save up to 3 lives. India alone needs 5 crore units annually but collects only 4 crore.`,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
      readTime: 5,
      tags: ['myths', 'facts', 'awareness', 'donation'],
    },
    {
      title: 'Yoga and Exercise for Better Blood Circulation',
      category: 'lifestyle',
      excerpt: 'Explore specific yoga poses and exercises scientifically proven to improve blood flow and cardiovascular health.',
      content: `Regular physical activity is one of the most effective ways to maintain healthy blood circulation and overall cardiovascular health.

**Best Yoga Poses for Blood Circulation**
- Viparita Karani (Legs Up the Wall): Reverses blood flow from legs to heart
- Sarvangasana (Shoulder Stand): Stimulates thyroid and improves circulation
- Uttanasana (Forward Fold): Increases blood flow to the brain
- Trikonasana (Triangle Pose): Opens chest and improves lung capacity

**Cardiovascular Exercises**
Brisk walking, swimming, cycling, and jogging for 30 minutes daily significantly improve circulation. Even light movement every hour benefits blood flow for desk workers.

**Breathing Exercises (Pranayama)**
Anulom Vilom (alternate nostril breathing) and Kapalbhati enhance oxygenation of blood and strengthen the cardiovascular system.

**Post-Donation Exercise Tips**
Wait at least 24-48 hours after donation before resuming intense exercise. Light walking is fine and actually helps improve circulation.`,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      readTime: 6,
      tags: ['yoga', 'exercise', 'circulation', 'lifestyle'],
    },
  ];

  await Article.insertMany(articles);
  console.log('✅ Articles seeded');
};

// Get all articles
router.get('/', async (req, res) => {
  try {
    await seedArticles();
    const { category, page = 1 } = req.query;
    const query = category && category !== 'all' ? { category } : {};

    const articles = await Article.find(query)
      .select('-content')
      .sort('-createdAt')
      .skip((page - 1) * 6)
      .limit(6);

    const total = await Article.countDocuments(query);
    res.json({ articles, total, pages: Math.ceil(total / 6) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
