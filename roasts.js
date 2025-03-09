/**
 * BURN MASTER - Ultimate Roast Generator
 * roasts.js - Contains all roast content and generation logic
 */

(function() {
    // Component arrays for building dynamically combined roasts
    const roastComponents = {
        // Openers - how the roast begins
        openers: {
            general: [
                "You're", "You are", "Honestly, you're", "Let's be real, you're", 
                "I've never seen someone so", "It's impressive how you're", 
                "Congratulations on being", "Somehow you manage to be",
                "You've perfected being", "Only you could be"
            ],
            appearance: [
                "You look like", "Your appearance is like", "Your face resembles", 
                "Your style is basically", "You dress like", "Your haircut looks like",
                "Your fashion sense is like", "Your entire aesthetic is basically",
                "Visually, you're basically", "Your whole look screams"
            ],
            personality: [
                "Your personality is", "Your vibe is exactly like", "You give off the energy of", 
                "Your presence is comparable to", "Talking to you is like", "Being around you is like",
                "Your presence is basically", "Your attitude is essentially", "Mentally, you're",
                "The way you act is like"
            ],
            skills: [
                "Your abilities are", "Your talent is comparable to", "Your skill level is like", 
                "Your competence resembles", "The way you perform is like", "Your technique is basically",
                "Your approach to tasks is like", "Your method is similar to", "Your execution is like",
                "Your capability is on par with"
            ]
        },
        
        // Descriptors - connecting phrases
        descriptors: {
            // Intensity level 1 (Mild)
            1: {
                general: [
                    "about as useful as", "essentially just", "basically equivalent to", 
                    "remarkably similar to", "almost indistinguishable from", 
                    "fundamentally the same as", "the human version of", 
                    "practically a walking", "literally just", "nothing more than"
                ],
                appearance: [
                    "someone who was drawn by", "what happens when", 
                    "the visual equivalent of", "apparently inspired by", 
                    "somehow reminiscent of", "what I'd expect from", 
                    "the spitting image of", "accidentally styled after", 
                    "trying really hard to impersonate", "weirdly similar to"
                ],
                personality: [
                    "as engaging as", "about as interesting as", "the emotional equivalent of", 
                    "as memorable as", "as compelling as", "approximately as exciting as", 
                    "roughly as captivating as", "just about as stimulating as", 
                    "the conversational version of", "the social equivalent of"
                ],
                skills: [
                    "comparable to", "on par with", "about as effective as", 
                    "roughly as successful as", "performing at the level of", 
                    "showing the proficiency of", "demonstrating the aptitude of", 
                    "exhibiting the talent of", "matching the expertise of", 
                    "approaching tasks like"
                ]
            },
            // Intensity level 2 (Medium)
            2: {
                general: [
                    "somehow less useful than", "even worse than", "remarkably inferior to", 
                    "surprisingly more disappointing than", "even more frustrating than", 
                    "inexplicably more annoying than", "shockingly less effective than", 
                    "consistently more troublesome than", "reliably more irritating than", 
                    "perpetually more exasperating than"
                ],
                appearance: [
                    "what would happen if", "the unfortunate result of", 
                    "a failed attempt at", "a botched version of", 
                    "a severely misunderstood version of", "a deeply confused take on", 
                    "what happens when someone misinterprets", "a tragically inaccurate rendition of", 
                    "what AI would generate if asked to create", "the rejected concept art for"
                ],
                personality: [
                    "more tedious than", "duller than", "flatter than", 
                    "less dynamic than", "more exhausting than", 
                    "more taxing than", "more draining than", 
                    "less stimulating than", "more monotonous than", 
                    "more one-dimensional than"
                ],
                skills: [
                    "struggling more than", "less capable than", "more inept than", 
                    "more incompetent than", "making more mistakes than", 
                    "more error-prone than", "less proficient than", 
                    "less adept than", "more clumsy than", "more awkward than"
                ]
            },
            // Intensity level 3 (Savage)
            3: {
                general: [
                    "the absolute worst version of", "a living monument to", 
                    "a cautionary tale about", "a walking advertisement against", 
                    "the definitive argument against", "irrefutable proof that", 
                    "compelling evidence for banning", "the strongest case for avoiding", 
                    "an urgent warning about", "undeniable confirmation of the dangers of"
                ],
                appearance: [
                    "what would emerge if", "what would crawl out if", 
                    "the horrifying result of", "the visual equivalent of", 
                    "what scientists would create if they combined", 
                    "a catastrophic collision between", "the unfortunate offspring of", 
                    "what happens when you cross", "a graphic warning label for", 
                    "the physical embodiment of"
                ],
                personality: [
                    "infinitely worse than", "exponentially more insufferable than", 
                    "monumentally more unbearable than", "categorically more intolerable than", 
                    "unquestionably more exasperating than", "indisputably more grating than", 
                    "undeniably more vexing than", "unequivocally more tiresome than", 
                    "indescribably more wearing than", "inconceivably more tiring than"
                ],
                skills: [
                    "catastrophically worse than", "disastrously less competent than", 
                    "horrifyingly more inept than", "shockingly less capable than", 
                    "embarrassingly more incompetent than", "humiliatingly less skilled than", 
                    "mortifyingly less proficient than", "appallingly less adept than", 
                    "astonishingly more useless than", "staggeringly less effective than"
                ]
            }
        },
        
        // Objects - what they're being compared to - all reformatted to work with descriptors
        objects: {
            // Intensity level 1 (Mild)
            1: {
                general: [
                    "a screen door on a submarine.", "a chocolate teapot.", 
                    "a solar-powered flashlight.", "elevator music.", 
                    "a participation award.", "unseasoned chicken.", 
                    "a cloudy day at the beach.", "a dial-up modem in 2025.", 
                    "decaf coffee.", "hotel art."
                ],
                appearance: [
                    "a child with their first box of crayons.", "a randomized video game character.", 
                    "a mannequin designed by committee.", "something assembled from spare parts.", 
                    "a photo taken with a potato.", "a thrift store mannequin.", 
                    "a scarecrow in business casual.", "a wax figure left in the sun.", 
                    "a human Etch-a-Sketch drawing.", "a default avatar."
                ],
                personality: [
                    "watching paint dry.", "reading the 'Terms and Conditions' page.", 
                    "a blank piece of paper.", "an automated phone menu.", 
                    "reading the phone book.", "beige wallpaper.", 
                    "the middle seat on a long flight.", "static on a TV.", 
                    "waiting at the DMV.", "plain, cold oatmeal."
                ],
                skills: [
                    "a toddler trying to use chopsticks.", "a cat trying to swim.", 
                    "someone typing with oven mitts on.", "writing with your non-dominant hand.", 
                    "trying to solve a puzzle blindfolded.", "using Google Maps without internet.", 
                    "following IKEA instructions backwards.", "riding a bike with square wheels.", 
                    "playing chess without knowing the rules.", "parallel parking a cruise ship."
                ]
            },
            // Intensity level 2 (Medium)
            2: {
                general: [
                    "a chocolate teapot in a sauna.", "a submarine with screen doors.", 
                    "an ejection seat in a helicopter.", "a solar-powered flashlight at night.", 
                    "fireproof matches.", "waterproof teabags.", 
                    "a glass hammer.", "an inflatable dartboard.", 
                    "a concrete life jacket.", "a pedal-powered wheelchair."
                ],
                appearance: [
                    "a scarecrow that scares other scarecrows.", "a caricature of a caricature.", 
                    "what happens when you press 'randomize' twice.", "a mannequin that other mannequins make fun of.", 
                    "a before picture that's worse than the after.", "a 3D model rendered on a calculator.", 
                    "a DIY plastic surgery attempt.", "a Mr. Potato Head assembled by a toddler.", 
                    "what happens when you let AI generate a person.", "a character design rejected by every studio."
                ],
                personality: [
                    "a documentary about watching paint dry.", "reading the dictionary backwards.", 
                    "attending a seminar on the history of beige.", "a four-hour PowerPoint about semicolons.", 
                    "an audiobook of silence.", "a museum exhibit about empty spaces.", 
                    "a lecture on the differences between types of white bread.", "watching a loading bar that never completes.", 
                    "a podcast about different types of static.", "a blog dedicated to watching grass grow."
                ],
                skills: [
                    "trying to herd cats while blindfolded.", "knitting with spaghetti.", 
                    "playing the piano with oven mitts.", "performing brain surgery with a spoon.", 
                    "trying to catch fish in the desert.", "painting a masterpiece with a sledgehammer.", 
                    "writing poetry with alphabet soup.", "building a sandcastle during a hurricane.", 
                    "trying to solve a Rubik's Cube underwater.", "playing darts on a rollercoaster."
                ]
            },
            // Intensity level 3 (Savage)
            3: {
                general: [
                    "a dumpster fire at a garbage convention.", "a flat-earther at NASA.", 
                    "an anti-vaxxer at a medical conference.", "a screen door on a nuclear submarine.", 
                    "a chocolate fireguard in hell.", "a glass hammer in a rock-throwing contest.", 
                    "an umbrella in a hurricane.", "a life jacket made of cement.", 
                    "a parachute with holes.", "a fire extinguisher filled with gasoline."
                ],
                appearance: [
                    "a caricature artist's worst nightmare.", "a blindfolded child using Photoshop.", 
                    "the 'after' picture in a warning about what not to do.", "a failed cloning experiment.", 
                    "a sketch artist's revenge drawing.", "an AI's interpretation of 'ugly human'.", 
                    "a mannequin that was rejected for being too disturbing.", "a wax figure that melted and was reassembled wrong.", 
                    "a glitch in the character creation screen.", "the reason beauty standards keep changing."
                ],
                personality: [
                    "the void staring back.", "a black hole of charisma.", 
                    "the concept of boredom gaining sentience.", "beige becoming self-aware.", 
                    "the reason people invented the mute button.", "the inspiration for 'exit' signs.", 
                    "why aliens won't talk to us.", "the reason therapists need therapists.", 
                    "the final boss of awkward silence.", "the embodiment of 'no personality'."
                ],
                skills: [
                    "a sloth trying to win an Olympic sprint.", "a fish trying to climb Mount Everest.", 
                    "a penguin trying to fly across the Sahara.", "a giraffe attempting limbo.", 
                    "someone using chopsticks during an earthquake.", "trying to catch lightning with a wet paper bag.", 
                    "performing heart surgery with a sledgehammer.", "trying to put out a forest fire with a water pistol.", 
                    "attempting to solve quantum physics with a crayon.", "trying to win a spelling bee by barking."
                ]
            }
        },
        
        // Closers - optional final part
        closers: {
            // Intensity level 1 (Mild)
            1: [
                "Impressive, really.", 
                "That's actually kind of special.", 
                "I'm almost impressed.", 
                "It takes talent to be that mediocre.", 
                "And that's on a good day.", 
                "At least you're consistent.", 
                "I'd say do better, but this might be your peak.", 
                "Some people might find that endearing.", 
                "Bless your heart.", 
                "But I'm sure you're trying your best."
            ],
            // Intensity level 2 (Medium)
            2: [
                "That's a special kind of accomplishment.", 
                "Did you practice to get that bad?", 
                "Your parents must be so proud.", 
                "I'd be embarrassed, but you do you.", 
                "That's actually impressive in the worst way.", 
                "I'm struggling to understand how that's even possible.", 
                "You really outdid yourself there.", 
                "That's a level of inadequacy I didn't think was achievable.", 
                "I'd tell you to do better, but we both know that's not happening.", 
                "Maybe consider a different approach to... everything?"
            ],
            // Intensity level 3 (Savage)
            3: [
                "I'm genuinely concerned for everyone around you.", 
                "The bar was on the ground and you brought a shovel.", 
                "You've made failure an art form.", 
                "That's not just a red flag, it's a whole communist parade.", 
                "Please tell me this isn't your best effort.", 
                "I'd say you hit rock bottom, but you seem to be digging.", 
                "This is why aliens won't talk to us.", 
                "You're the reason we need warning labels on everything.", 
                "Evolution is clearly going backwards in your case.", 
                "I've never met someone who makes natural selection seem so tempting."
            ]
        }
    };

    // Collection of pre-written complete roasts (for variety)
    const roastCollection = {
        general: {
            // Intensity level 1 (Mild)
            1: [
                "You're about as useful as a screen door on a submarine.",
                "If you were a spice, you'd be flour.",
                "You have the personality of a wet paper towel.",
                "I'm not saying you're boring, but you make vanilla look exotic.",
                "You're the human equivalent of a participation award.",
                "Your personality has less flavor than unseasoned chicken.",
                "If you were a book, you'd be two hundred pages of appendices.",
                "You're like a cloudy day - not the worst, but nobody's excited to see you.",
                "You remind me of a knockoff brand - similar to the real thing but not quite right.",
                "You have all the charm of a telemarketer calling during dinner."
            ],
            // Intensity level 2 (Medium)
            2: [
                "Your family tree must be a cactus because everyone on it is a prick.",
                "I'd agree with you but then we'd both be wrong.",
                "You're not the dumbest person on earth, but you better hope they don't die.",
                "If common sense was common, you'd have some.",
                "I'm not saying I hate you, but I would unplug your life support to charge my phone.",
                "You're the reason they put instructions on shampoo bottles.",
                "If laughter is the best medicine, your face must be curing the world.",
                "I thought of you today. It reminded me to take out the trash.",
                "You're like a cloud. When you disappear, it's a beautiful day.",
                "Some people just need a high-five. In the face. With a chair."
            ],
            // Intensity level 3 (Savage)
            3: [
                "Scientists say the universe is made up of neutrons, protons, and electrons. They forgot to mention morons like you.",
                "You're so dense, light bends around you.",
                "I'm jealous of people who don't know you.",
                "If I wanted to kill myself, I'd climb your ego and jump to your IQ.",
                "I would roast you, but my mom said I'm not allowed to burn trash.",
                "You bring everyone so much joy when you leave the room.",
                "You're not a complete idiot... Some parts are clearly missing.",
                "I'd tell you to go to hell, but I don't want to see you again.",
                "If stupidity was a currency, you'd be a billionaire.",
                "You're the human equivalent of a participation award for breathing."
            ]
        },
        appearance: {
            // Intensity level 1 (Mild)
            1: [
                "You look like you were drawn with my left hand.",
                "Your fashion sense is almost as questionable as your life choices.",
                "Your face makes onions cry.",
                "You look like you're trying to impersonate a human being.",
                "Your haircut says 'I cut this myself while falling down the stairs.'",
                "You dress like you lost a bet with a thrift store.",
                "You have a face for radio and a voice for silent films.",
                "You look like you were assembled from spare parts.",
                "Your style is what happens when you press 'randomize' on a character creator.",
                "You look how stepping on a wet spot with socks feels."
            ],
            // Intensity level 2 (Medium)
            2: [
                "If you were a Pokemon, your evolution would be backwards.",
                "Your face is so oily America wants to invade it.",
                "You weren't born, you were released as a public safety warning.",
                "You look like the before picture in every advertisement.",
                "You look like someone tried to draw a person from memory.",
                "You have the kind of face that makes blind people feel lucky.",
                "Did you fall from heaven? Because it looks like you landed on your face.",
                "Your genetics are like a practical joke that never ends.",
                "You look like you were made in Photoshop by someone who just installed it.",
                "Your face has more filters than your Instagram posts."
            ],
            // Intensity level 3 (Savage)
            3: [
                "If ugly was a crime, you'd get the death penalty.",
                "You look like something I'd draw with my left hand.",
                "I've seen better looking faces on cash register receipts.",
                "You're so ugly, when your mom dropped you off at school she got a ticket for littering.",
                "If you were any uglier, you'd be a modern art masterpiece.",
                "You look like the result of pressing 'randomize' on a character creation screen that was already broken.",
                "You're so ugly, Medusa looked at you and turned to stone.",
                "You're so ugly, your portraits hang themselves.",
                "When God was handing out looks, you thought he said 'books' and asked for a refund.",
                "You look like what morning breath would be if it took human form."
            ]
        },
        personality: {
            // Intensity level 1 (Mild)
            1: [
                "Your personality is like elevator music - present but forgettable.",
                "You have the charisma of a wet sock.",
                "Your personality is as consistent as your Wi-Fi connection.",
                "You've got the emotional range of a teaspoon.",
                "You're like room temperature water - neither refreshing nor offensive.",
                "You're as deep as a kiddie pool.",
                "Your personality has all the excitement of watching paint dry.",
                "You're as predictable as the plot of a Hallmark movie.",
                "Your personality is like a plain rice cake - functional but bland.",
                "You're about as interesting as the 'Terms and Conditions' page."
            ],
            // Intensity level 2 (Medium)
            2: [
                "You have the emotional depth of a puddle.",
                "Your personality makes bread look exciting.",
                "Your sense of humor is drier than the Sahara Desert.",
                "You're like a black hole, but instead of light, you suck all the joy out of the room.",
                "Your personality has been described as 'aggressively beige.'",
                "You have all the charm of a telemarketer and twice the persistence.",
                "Your personality is so bland it makes vanilla extract seem spicy.",
                "You're the human equivalent of decaffeinated coffee.",
                "You have the excitement level of a tax audit.",
                "Your personality is like a museum exhibit - don't touch, don't engage, just observe from a distance."
            ],
            // Intensity level 3 (Savage)
            3: [
                "Your personality has fewer dimensions than a straight line.",
                "You have the charisma of a wet paper bag filled with hair.",
                "Your personality makes me want to take a vow of solitude.",
                "Talking to you is like having a staring contest with a wall, except the wall is more engaging.",
                "If personalities were flavors, yours would be expired milk.",
                "Your presence has the same effect as an open casket at a birthday party.",
                "Your personality is so toxic it should come with a hazard warning.",
                "You have the charm of a restraining order and the appeal of a root canal.",
                "Your personality is like being stuck in an elevator with someone who just ate garlic - painful and seemingly endless.",
                "You suck the life out of a room so effectively that plants wilt when you enter."
            ]
        },
        skills: {
            // Intensity level 1 (Mild)
            1: [
                "Your skills are like a unicorn - mythical and non-existent.",
                "Your talent is impressively underwhelming.",
                "Your abilities are about as useful as a chocolate teapot.",
                "You have the coordination of a newborn giraffe.",
                "Your skill set is like Swiss cheese - mostly holes.",
                "Your expertise is theoretical at best.",
                "Your competence is an elaborate optical illusion.",
                "Your talents are like bigfoot - often discussed but never actually witnessed.",
                "Your skills are as developed as a disposable camera.",
                "Your abilities make remedial classes look advanced."
            ],
            // Intensity level 2 (Medium)
            2: [
                "You're so unskilled you could mess up a cup of instant ramen.",
                "Your talents are like a broken clock - wrong most of the time.",
                "You fail upward with such consistency it's almost impressive.",
                "Your skill level makes amateurs look professional.",
                "You have the dexterity of someone wearing oven mitts trying to thread a needle.",
                "Your competence is so low it's actually being studied by scientists.",
                "You could mess up a one-piece puzzle.",
                "Your abilities are like a flat tire on a wheelchair - not going anywhere fast.",
                "Your talents are so non-existent, they've been declared a cryptid.",
                "You have the capabilities of a potato, but with less versatility."
            ],
            // Intensity level 3 (Savage)
            3: [
                "Your skills are so underdeveloped they qualify for government assistance.",
                "Watching you attempt tasks is like watching a fish climb a tree.",
                "Your abilities are so pathetic they've redefined the concept of incompetence.",
                "Your skill level is the human equivalent of trying to put out a fire with gasoline.",
                "You're so bad at everything that failure sees you coming and says 'I learned it from watching you!'",
                "Your talents are so non-existent they're being studied as a new form of antimatter.",
                "Your competence is like dividing by zero - it just doesn't compute.",
                "You've elevated incompetence to an art form that even modern artists find too abstract.",
                "Your abilities are like trying to use a spoon to cut down a redwood tree - hopelessly inadequate.",
                "Your skill set is so pitiful it makes the Hindenburg look like a success story."
            ]
        }
    };

    // Function to get a pre-written roast
    function getPrewrittenRoast(category, intensity) {
        // Default to general category if the requested one doesn't exist
        if (!roastCollection[category]) {
            category = 'general';
        }
        
        // Default to medium intensity if the requested one doesn't exist
        if (!roastCollection[category][intensity]) {
            intensity = 2;
        }
        
        const roasts = roastCollection[category][intensity];
        return roasts[Math.floor(Math.random() * roasts.length)];
    }
    
    // Function to generate a dynamic roast by combining components
    function generateDynamicRoast(category, intensity) {
        // Default to general category if the requested one doesn't exist
        if (!roastComponents.openers[category]) {
            category = 'general';
        }
        
        // Default to medium intensity if the requested one doesn't exist
        if (!roastComponents.descriptors[intensity]) {
            intensity = 2;
        }
        
        // Get random components
        const opener = roastComponents.openers[category][Math.floor(Math.random() * roastComponents.openers[category].length)];
        const descriptor = roastComponents.descriptors[intensity][category][Math.floor(Math.random() * roastComponents.descriptors[intensity][category].length)];
        const object = roastComponents.objects[intensity][category][Math.floor(Math.random() * roastComponents.objects[intensity][category].length)];
        
        // 70% chance to add a closer
        let closer = '';
        if (Math.random() < 0.7) {
            closer = ' ' + roastComponents.closers[intensity][Math.floor(Math.random() * roastComponents.closers[intensity].length)];
        }
        
        // Combine components into a full roast
        return `${opener} ${descriptor} ${object}${closer}`;
    }
    
    // Main function to get a roast (50% chance of prewritten, 50% chance of dynamic)
    function getRoast(category, intensity) {
        // Add a special "random" option that chooses a random category
        if (category === 'random') {
            const categories = Object.keys(roastCollection);
            category = categories[Math.floor(Math.random() * categories.length)];
        }
        
        // 50/50 chance between prewritten and dynamic roasts
        if (Math.random() < 0.5) {
            return getPrewrittenRoast(category, intensity);
        } else {
            return generateDynamicRoast(category, intensity);
        }
    }
    
    // Add a function to get multiple roasts
    function getMultipleRoasts(category, intensity, count) {
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(getRoast(category, intensity));
        }
        return results;
    }
    
    // Add a function to get roasts from all categories at a specific intensity
    function getRoastPackage(intensity) {
        const categories = Object.keys(roastCollection);
        const package = {};
        
        categories.forEach(category => {
            package[category] = getRoast(category, intensity);
        });
        
        return package;
    }
    
    // Expose the functions to the global scope
    window.getRoast = getRoast;
    window.getMultipleRoasts = getMultipleRoasts;
    window.getRoastPackage = getRoastPackage;
})();