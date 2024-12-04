export const instructions = {
    "steps": [
        {
            "name": "Transfer",
            "type":3,

            "heading":"Sample Transfer",
            "images":["2-1transfer","2-2transfer","2-3transfer"],
            "info":["Remove Sample Tube lid (with attached swab) and carefully set aside.","Open Tube A Lysis and set into the stand. \r\nUse the 400µl Exact Volume Pipette to collect Patient Sample and dispense into tube A Lysis.","Insert SmartLid firmly into tube A Lysis"],
            "addInfo":["NOTE: Some swabs may remain in the tube.","Discard pipette appropriately."],
            "description":"Transfer patient sample into tube A Lysis.",
            "image":"/images/03 transfer.png",
            "steps": [
                {
                    description: "Open tube 1",
                    video: "/videos/640_DSK-Step-1.mp4"
                },

            ]
        },
        {
            "name": "Lysis",
            "heading":"Lysis",
            "type":4,
            "images":["3-1lysis","3-2lysis","3-3lysis","3-4lysis"],
            "info":["Remove magnet.","Mix by shaking for 30 seconds to lyse cells and bind nucleic acids to magnetic beads.","Insert the magnet into the SmartLid and turn to lock.","Remove the SmartLid from tube A Lysis and insert onto tube B Wash."],
            "addInfo":["Set magnet in the preparation stand for later use.","","Invert until the liquid is clear to collect the magnetic beads onto the SmartLid.","Close and discard tube A Lysis appropriately."],
            "description":"Extract and capture nucleic acids from the sample.",
            "image":"/images/04 lysis.png",
            "steps": [
                {
                    description: "Open tube 1",
                    video: "/videos/640_DSK-Step-1.mp4"
                },
                {
                    description: "Open the eNAT tube",
                    video: "/videos/640_DSK-Step-2.mp4",
                    showTimer: true,
                    timerId: "LYSIS_1"
                },
                {
                    description: "Collect the sample",
                    video: "/videos/640_DSK-Step-3.mp4"
                },
                {
                    description: "Close the eNAT tube",
                    video: "/videos/640_DSK-Step-5.mp4"
                }
            ]
        },
        {
            "name": "Wash",
            "heading":"Wash",
            "type":4,
            "images":["4-1wash","4-2wash","4-3wash","4-4wash"],
            "info":["Remove magnet.","Shake for 30 seconds to wash contaminants from nucleic acids.","Insert and lock magnet into the SmartLid.","Remove SmartLid and place drying stand for 30 seconds."],
            "addInfo":["Set magnet in the preparation stand for later use","","Invert until the liquid is clear to collect the magnetic beads onto the SmartLid","Close and discard tube B Wash appropriately."],
            "description":"Purify captured nucleic acids.",
            "image":"/images/05 wash.png",
            "steps": [
                {
                    description: "Mix tube 2",
                    video: "/videos/640_09.mp4"
                },
                {
                    description: "Capture the beads",
                    video: "/videos/640_10.mp4",
                    showTimer: true,
                    timerId: "WASH_1"
                },
                {
                    description: "Dry the beads",
                    video: "/videos/640_11.mp4",

                },
                {
                    description: "Transfer the SmartLid to tube 3",
                    video: "/videos/640_12.mp4",
                    showTimer: true,
                    timerId: "WASH_2"
                }
            ]
        },
        {
            "name": "Elution",
            "heading":"Elution",
            "type":4,
            "images":["5-1elution","5-2elution","5-3elution","5-4elution"],
            "info":["Insert SmartLid into tube C Elution and remove magnet. ","Mix by shaking for 30 seconds to release the nucleic acids from the magnetic beads.","Insert and lock magnet into the SmartLid.","Remove the SmartLid and dispose of appropriately."],
            "addInfo":["Set magnet into the preparation stand for later use.","","Invert until the liquid is clear to collect the magnetic beads onto the SmartLid","The sample is now purified and ready for analysis."],
            "description":"Release nucleic acids into solution and discard magnetic beads.",
            "image":"/images/06 Elution.png",
            "steps": [
                {
                    description: "Mix tube 3",
                    video: "/videos/640_13.mp4"
                },
                {
                    description: "Mix tube 3",
                    video: "/videos/640_13.mp4",
                    showTimer: true,
                    timerId: "Elution_1"
                },
                {
                    description: "Capture the beads",
                    video: "/videos/640_14.mp4"
                },
                {
                    description: "Remove the SmartLid",
                    video: "/videos/640_15.mp4"
                }
            ]
        },

        {
            "name": "Load",
            "heading":"Load Test Panel",
            "type":2,
            "images":["6-1load","6-2load"],
            "info":["With a new pipette tip, collect and dispense 20µl of purified sample from tube C Elution into each test panel reaction tube.","Close each tube securely after loading. "],
            "addInfo":["IMPORTANT: Do not touch the lyophilised reagent with the tip. Change the pipette tip if in doubt.","IMPORTANT: Do not open caps after incubation."],
            "description":"Dispense elution into each reaction tube of the Test Panel.",
            "image":"/images/07 load test panel.png",
            "steps": [
                {
                    description: "Load",
                    video: "/videos/640_16.mp4",
                    images:"/images/load test panel.png"
                },

            ]
        },
        {
            "name": "Heat",
            "type":2,

            "heading":"Load Heat Block",
            "images":["7-1heat","7-2heat"],
            "info":["Insert the Test Panel into the pre-heated Heat Block.","Tap the row button above to confirm where you inserted the Test Panel."],
            "addInfo":["IMPORTANT: Take note of the row number and close the cover.","IMPORTANT: This will be used to remind you which to remove at the end of the test."],
            "description":"Place loaded Test Panel into Heat Block and confirm row selected",
            "image":"/images/08 load heat block.png",
            "steps": [
                {
                    description: "Heat",
                    video: "/videos/640_16.mp4",
                    images:"/images/load test panel.png"
                },

            ]
        },
        {
            "name": "Capture",
            "type":4,
            "heading":"Unload Test",
            "images":["8-1capture","8-2capture"],
            "info":["Carefully remove the Test Panel from the Heat Block."," Fold open the Result Capture Card and place the test panel into position as shown."],
            "addInfo":["Note the row number and close the cover.",""],
            "description":"Remove incubated Test Panel ",
            "description_1":" from Heat Block row ",
            "description_2":" and place into Result Capture Card to interpret.",
            "image":"/images/09 result capture.png",
            "steps": [
                {
                    description: "Heat",
                    video: "/videos/640_16.mp4"
                },

            ]

        },
    ]
}

export const steps = instructions.steps.map((step) => {
    if(step.steps.length)
        return step.name
    return ""
})

export const AdvanceInstructions =  {"steps": [

    {
        "name": "Lysis",
        "timer":true,
        "heading":"Lysis",
        "prevStep":"scan",
        timerId: "LYSIS_1",
        "description":"Extract and capture nucleic acids from the sample.",
        "image":"/images/04 lysis.png",
        "steps": [
            {
                description: "Open tube 1",
                video: "/videos/640_DSK-Step-1.mp4"
            },
            {
                description: "Open the eNAT tube",
                video: "/videos/640_DSK-Step-2.mp4",
                showTimer: true,
                timerId: "LYSIS_1"
            },
            {
                description: "Collect the sample",
                video: "/videos/640_DSK-Step-3.mp4"
            },
            {
                description: "Close the eNAT tube",
                video: "/videos/640_DSK-Step-5.mp4"
            }
        ]
    },
    {
        "name": "Wash",
        "timer":true,
        "heading":"Wash",
        "prevStep":"Lysis",
        timerId: "WASH_1",
        "description":"Purify captured nucleic acids.",
        "image":"/images/05 wash.png",
        "steps": [
            {
                description: "Mix tube 2",
                video: "/videos/640_09.mp4"
            },
            {
                description: "Capture the beads",
                video: "/videos/640_10.mp4",
                showTimer: true,
                timerId: "WASH_1"
            },
            {
                description: "Dry the beads",
                video: "/videos/640_11.mp4",

            },
            {
                description: "Transfer the SmartLid to tube 3",
                video: "/videos/640_12.mp4",
                showTimer: true,
                timerId: "WASH_2"
            }
        ]
    },
    {
        "name": "Dry",
        "timer":true,
        "heading":"Elution",
        "prevStep":"Wash",
        timerId: "DRY_1",
        "description":"Release nucleic acids into solution and discard magnetic beads.",
        "image":"/images/06 Elution.png",
        "steps": [
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4"
            },
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4",
                showTimer: true,
                timerId: "Elution_1"
            },
            {
                description: "Capture the beads",
                video: "/videos/640_14.mp4"
            },
            {
                description: "Remove the SmartLid",
                video: "/videos/640_15.mp4"
            }
        ]
    },
    {
        "name": "Elute",
        "timer":true,
        "heading":"Elution",
        "prevStep":"Dry",
        timerId: "Elution_1",
        "description":"Release nucleic acids into solution and discard magnetic beads.",
        "image":"/images/06 Elution.png",
        "steps": [
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4"
            },
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4",
                showTimer: true,
                timerId: "Elution_1"
            },
            {
                description: "Capture the beads",
                video: "/videos/640_14.mp4"
            },
            {
                description: "Remove the SmartLid",
                video: "/videos/640_15.mp4"
            }
        ]
    },


]
}


export const IFUInstructions =  {

    "Lysis":{
        "name": "Lysis",
        "timer":true,
        "prevStep":"scan",
        "heading":"Lysis",
        timerId: "LYSIS_1",
        "description":"Extract and capture nucleic acids from the sample.",
        "image":"/images/04 lysis.png",
        "steps": [
            {
                description: "Open tube 1",
                video: "/videos/640_DSK-Step-1.mp4"
            },
            {
                description: "Open the eNAT tube",
                video: "/videos/640_DSK-Step-2.mp4",
                showTimer: true,
                timerId: "LYSIS_1"
            },
            {
                description: "Collect the sample",
                video: "/videos/640_DSK-Step-3.mp4"
            },
            {
                description: "Close the eNAT tube",
                video: "/videos/640_DSK-Step-5.mp4"
            }
        ]
    },
    "Wash":{
        "name": "Wash",
        "timer":true,
        "heading":"Wash",
        "prevStep":"Lysis",
        timerId: "WASH_1",
        "description":"Purify captured nucleic acids.",
        "image":"/images/05 wash.png",
        "steps": [
            {
                description: "Mix tube 2",
                video: "/videos/640_09.mp4"
            },
            {
                description: "Capture the beads",
                video: "/videos/640_10.mp4",
                showTimer: true,
                timerId: "WASH_1"
            },
            {
                description: "Dry the beads",
                video: "/videos/640_11.mp4",

            },
            {
                description: "Transfer the SmartLid to tube 3",
                video: "/videos/640_12.mp4",
                showTimer: true,
                timerId: "WASH_2"
            }
        ]
    },
    "Dry":{
        "name": "Dry",
        "timer":true,
        "heading":"Elution",
        "prevStep":"Wash",
        timerId: "DRY_1",
        "description":"Release nucleic acids into solution and discard magnetic beads.",
        "image":"/images/06 Elution.png",
        "steps": [
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4"
            },
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4",
                showTimer: true,
                timerId: "Elution_1"
            },
            {
                description: "Capture the beads",
                video: "/videos/640_14.mp4"
            },
            {
                description: "Remove the SmartLid",
                video: "/videos/640_15.mp4"
            }
        ]
    },
    "Elute":{
        "name": "Elute",
        "timer":true,
        "heading":"Elution",
        "prevStep":"Dry",
        timerId: "Elution_1",
        "description":"Release nucleic acids into solution and discard magnetic beads.",
        "image":"/images/06 Elution.png",
        "steps": [
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4"
            },
            {
                description: "Mix tube 3",
                video: "/videos/640_13.mp4",
                showTimer: true,
                timerId: "Elution_1"
            },
            {
                description: "Capture the beads",
                video: "/videos/640_14.mp4"
            },
            {
                description: "Remove the SmartLid",
                video: "/videos/640_15.mp4"
            }
        ]
    },



}
