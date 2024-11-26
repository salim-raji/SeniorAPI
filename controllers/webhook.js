const express = require('express');
const bodyParser = require('body-parser');
const Place = require('./models/place');

const app = express();
app.use(bodyParser.json());

// Helper function to calculate total cost of a plan
function calculateTotalCost(plan) {
    return plan.reduce((sum, place) => sum + place.budget, 0);
}

// Helper function to format the day plan
function formatDayPlan(plan) {
    return plan
        .map((place, index) => `${index + 1}. ${place.name} - ${place.type} (${place.budget} USD)\n   Address: ${place.address}`)
        .join('\n');
}

// Webhook for creating a day plan
app.post('/webhook', async (req, res) => {
    try {
        // Extract parameters from the Dialogflow request
        const { queryResult } = req.body;
        const intent = queryResult.intent.displayName;
        const { budget, preferences } = queryResult.parameters;

        if (intent !== 'CreateDayPlan') {
            return res.json({
                fulfillmentMessages: [
                    {
                        text: { text: ['Invalid intent for this webhook.'] },
                    },
                ],
            });
        }

        // Query database for matching places
        let places = await Place.find({
            budget: { $lte: budget }, // Within the budget
        });

        // Filter based on preferences, if provided
        if (preferences) {
            if (preferences.cuisine) {
                places = places.filter((place) => place.cuisineType === preferences.cuisine);
            }
            if (preferences.type) {
                places = places.filter((place) => preferences.type.includes(place.type));
            }
            if (preferences.ambiance) {
                places = places.filter((place) => place.ambiance === preferences.ambiance);
            }
        }

        // Sort by rating or other criteria (e.g., user preference weight)
        places.sort((a, b) => b.rating - a.rating);

        // Build a plan (Morning, Afternoon, Evening)
        const dayPlan = [];
        let remainingBudget = budget;

        const types = ['Breakfast', 'Activity', 'Lunch', 'Sightseeing', 'Dinner', 'Nightlife'];
        for (const type of types) {
            const selectedPlace = places.find(
                (place) =>
                    place.type.toLowerCase() === type.toLowerCase() &&
                    place.budget <= remainingBudget
            );
            if (selectedPlace) {
                dayPlan.push(selectedPlace);
                remainingBudget -= selectedPlace.budget;
                // Remove the selected place from the pool to avoid re-selection
                places = places.filter((place) => place._id.toString() !== selectedPlace._id.toString());
            }
        }

        // Check if the plan was successfully created
        if (dayPlan.length === 0) {
            return res.json({
                fulfillmentMessages: [
                    {
                        text: {
                            text: [
                                'Sorry, I could not create a plan within your budget and preferences. Please try adjusting your input.',
                            ],
                        },
                    },
                ],
            });
        }

        // Format the response
        const responseText = `Here is your day plan:\n\n${formatDayPlan(dayPlan)}\n\nRemaining Budget: ${remainingBudget} USD`;

        // Send the response back to Dialogflow
        res.json({
            fulfillmentMessages: [
                {
                    text: { text: [responseText] },
                },
            ],
        });
    } catch (error) {
        console.error('Error processing day plan:', error);
        res.status(500).send('Error processing the request.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
});
