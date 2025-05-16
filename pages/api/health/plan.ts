import type { NextApiRequest, NextApiResponse } from 'next';

type Preferences = {
  dietaryPreference: string;
  workoutIntensity: string;
};

type DailyPlan = {
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  exercise: {
    type: string;
    duration: string;
    intensity: string;
  };
};

type WeeklyPlan = DailyPlan[];

const mealPlans = {
  balanced: {
    breakfast: [
      'Oatmeal with berries and nuts',
      'Greek yogurt with granola and honey',
      'Whole grain toast with avocado and eggs',
      'Smoothie bowl with fruits and seeds',
      'Scrambled eggs with whole grain toast',
      'Protein pancakes with maple syrup',
      'Breakfast burrito with beans and vegetables',
    ],
    lunch: [
      'Grilled chicken salad with mixed greens',
      'Quinoa bowl with roasted vegetables',
      'Turkey and avocado wrap',
      'Lentil soup with whole grain bread',
      'Mediterranean bowl with hummus',
      'Tuna salad with crackers',
      'Vegetable stir-fry with brown rice',
    ],
    dinner: [
      'Baked salmon with sweet potatoes',
      'Lean beef stir-fry with vegetables',
      'Grilled chicken with roasted vegetables',
      'Vegetable curry with brown rice',
      'Baked cod with quinoa',
      'Turkey meatballs with whole grain pasta',
      'Stuffed bell peppers with lean ground turkey',
    ],
  },
  vegetarian: {
    breakfast: [
      'Vegetable omelette with whole grain toast',
      'Greek yogurt parfait with fruits',
      'Avocado toast with poached eggs',
      'Smoothie bowl with plant-based protein',
      'Tofu scramble with vegetables',
      'Overnight oats with chia seeds',
      'Breakfast burrito with black beans',
    ],
    lunch: [
      'Mediterranean salad with feta',
      'Vegetable wrap with hummus',
      'Quinoa bowl with roasted vegetables',
      'Lentil soup with whole grain bread',
      'Falafel bowl with tahini',
      'Caprese sandwich with pesto',
      'Vegetable stir-fry with tofu',
    ],
    dinner: [
      'Vegetable curry with brown rice',
      'Stuffed bell peppers with quinoa',
      'Mushroom risotto',
      'Vegetable lasagna',
      'Sweet potato and black bean enchiladas',
      'Vegetable stir-fry with tofu',
      'Mediterranean vegetable bake',
    ],
  },
  // Add more meal plans for other dietary preferences
};

const exercisePlans = {
  light: {
    types: [
      'Walking',
      'Yoga',
      'Swimming',
      'Cycling',
      'Pilates',
      'Tai Chi',
      'Stretching',
    ],
    durations: ['20-30 minutes'],
    intensities: ['Low'],
  },
  moderate: {
    types: [
      'Jogging',
      'Cycling',
      'Swimming',
      'Dance',
      'HIIT',
      'Strength Training',
      'Circuit Training',
    ],
    durations: ['30-45 minutes'],
    intensities: ['Medium'],
  },
  intense: {
    types: [
      'Running',
      'CrossFit',
      'HIIT',
      'Strength Training',
      'Circuit Training',
      'Sprint Intervals',
      'Boxing',
    ],
    durations: ['45-60 minutes'],
    intensities: ['High'],
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeeklyPlan>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { dietaryPreference, workoutIntensity } = req.body as Preferences;

  // Generate weekly plan
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weeklyPlan: WeeklyPlan = days.map((day, index) => {
    const mealPlan = mealPlans[dietaryPreference as keyof typeof mealPlans] || mealPlans.balanced;
    const exercisePlan = exercisePlans[workoutIntensity as keyof typeof exercisePlans] || exercisePlans.moderate;

    return {
      day,
      meals: {
        breakfast: mealPlan.breakfast[index],
        lunch: mealPlan.lunch[index],
        dinner: mealPlan.dinner[index],
      },
      exercise: {
        type: exercisePlan.types[index],
        duration: exercisePlan.durations[0],
        intensity: exercisePlan.intensities[0],
      },
    };
  });

  res.status(200).json(weeklyPlan);
} 