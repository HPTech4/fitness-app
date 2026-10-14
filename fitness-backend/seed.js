// fitness-backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Workout = require('./models/Workout');

const workouts = [
  {
    title: 'Morning Stretch',
    description: 'Wake up your body with gentle full-body stretches.',
    category: 'Mobility',
    level: 'Beginner',
    duration: 10,
    calories: 40,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    isRecommended: false,
    exercises: [
      { name: 'Neck rolls', duration: 60, restTime: 15 },
      { name: 'Shoulder rolls', duration: 60, restTime: 15 },
      { name: 'Cat-cow stretch', reps: 10, restTime: 20 },
      { name: 'Forward fold', duration: 45, restTime: 15 },
      { name: 'Child pose', duration: 60, restTime: 15 },
    ],
  },
  {
    title: 'Power Walk',
    description: 'A brisk walk to get your heart rate up.',
    category: 'Cardio',
    level: 'Beginner',
    duration: 20,
    calories: 120,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    isRecommended: false,
    exercises: [
      { name: 'Warm-up walk', duration: 180, restTime: 0 },
      { name: 'Brisk walk', duration: 900, restTime: 0 },
      { name: 'Cool-down walk', duration: 120, restTime: 0 },
    ],
  },
  {
    title: 'Leg Workout',
    description: 'Build strong legs with squats, lunges, and glute bridges.',
    category: 'Strength',
    level: 'Intermediate',
    duration: 45,
    calories: 320,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    isRecommended: true,
    exercises: [
      { name: 'Goblet squat', sets: 3, reps: 12, restTime: 45 },
      { name: 'Reverse lunges', sets: 3, reps: 10, restTime: 45 },
      { name: 'Glute bridge', sets: 3, reps: 15, restTime: 40 },
      { name: 'Calf raises', sets: 3, reps: 20, restTime: 30 },
      { name: 'Wall sit', duration: 60, restTime: 45 },
    ],
  },
  {
    title: 'Upper Body Blast',
    description: 'Push, pull, and press your way to stronger arms and chest.',
    category: 'Strength',
    level: 'Intermediate',
    duration: 35,
    calories: 280,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    isRecommended: false,
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 12, restTime: 45 },
      { name: 'Dumbbell rows', sets: 3, reps: 10, restTime: 45 },
      { name: 'Shoulder press', sets: 3, reps: 10, restTime: 45 },
      { name: 'Bicep curls', sets: 3, reps: 12, restTime: 30 },
      { name: 'Tricep dips', sets: 3, reps: 10, restTime: 30 },
    ],
  },
  {
    title: 'Core Blast',
    description: 'Fast, intense core circuit for a stronger midsection.',
    category: 'Strength',
    level: 'Advanced',
    duration: 15,
    calories: 150,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    isRecommended: false,
    exercises: [
      { name: 'Plank', duration: 60, restTime: 20 },
      { name: 'Bicycle crunches', reps: 20, restTime: 20 },
      { name: 'Russian twists', reps: 30, restTime: 20 },
      { name: 'Leg raises', reps: 15, restTime: 30 },
      { name: 'Mountain climbers', duration: 45, restTime: 20 },
    ],
  },
  {
    title: 'HIIT Cardio',
    description: 'High-intensity intervals for max calorie burn.',
    category: 'Cardio',
    level: 'Advanced',
    duration: 25,
    calories: 350,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    isRecommended: false,
    exercises: [
      { name: 'Jumping jacks', duration: 45, restTime: 15 },
      { name: 'Burpees', duration: 45, restTime: 15 },
      { name: 'High knees', duration: 45, restTime: 15 },
      { name: 'Squat jumps', duration: 45, restTime: 15 },
      { name: 'Mountain climbers', duration: 45, restTime: 15 },
    ],
  },
  {
    title: 'Yoga Flow',
    description: 'A calming sequence to improve flexibility and focus.',
    category: 'Mobility',
    level: 'Beginner',
    duration: 30,
    calories: 100,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    isRecommended: false,
    exercises: [
      { name: 'Downward dog', duration: 60, restTime: 15 },
      { name: 'Warrior I', duration: 60, restTime: 15 },
      { name: 'Warrior II', duration: 60, restTime: 15 },
      { name: 'Tree pose', duration: 60, restTime: 15 },
      { name: 'Savasana', duration: 180, restTime: 0 },
    ],
  },
  {
    title: 'Full Body Burner',
    description: 'A full-body circuit that hits every muscle group.',
    category: 'Strength',
    level: 'Intermediate',
    duration: 40,
    calories: 380,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    isRecommended: true,
    exercises: [
      { name: 'Burpees', sets: 3, reps: 15, restTime: 45 },
      { name: 'Squats', sets: 3, reps: 15, restTime: 45 },
      { name: 'Push-ups', sets: 3, reps: 12, restTime: 45 },
      { name: 'Lunges', sets: 3, reps: 12, restTime: 45 },
      { name: 'Plank', duration: 60, restTime: 30 },
    ],
  },
  {
    title: 'Posture Fix',
    description: 'Strengthen your back and open tight shoulders.',
    category: 'Mobility',
    level: 'Beginner',
    duration: 12,
    calories: 50,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    isRecommended: false,
    exercises: [
      { name: 'Wall angels', reps: 15, restTime: 20 },
      { name: 'Band pull-aparts', reps: 20, restTime: 20 },
      { name: 'Thoracic extensions', reps: 10, restTime: 20 },
      { name: 'Chin tucks', reps: 15, restTime: 15 },
    ],
  },
  {
    title: 'Cardio Kickstart',
    description: 'Low-impact cardio to start your fitness journey.',
    category: 'Cardio',
    level: 'Beginner',
    duration: 18,
    calories: 140,
    image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800',
    isRecommended: false,
    exercises: [
      { name: 'March in place', duration: 120, restTime: 0 },
      { name: 'Step touches', duration: 120, restTime: 0 },
      { name: 'Knee lifts', duration: 120, restTime: 0 },
      { name: 'Side steps', duration: 120, restTime: 0 },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Workout.deleteMany({});
    console.log('🗑️  Cleared old workouts');

    const inserted = await Workout.insertMany(workouts);
    console.log(`🌱 Seeded ${inserted.length} workouts`);

    inserted.forEach((w) => {
      console.log(`   • ${w.title} [${w.category}] — ${w.duration}min`);
    });

    await mongoose.disconnect();
    console.log('✅ Done. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();