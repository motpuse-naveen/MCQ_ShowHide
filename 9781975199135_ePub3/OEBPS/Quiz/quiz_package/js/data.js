var data = {
    heading: "Directions:",
    content: "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum.",
    innerContent: "<p>Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit.</p>",
    buttonText: "Begin",

    questionsList: [{
        question: "<p>Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin?",
        queImage:"images/a.png",
		queImageThumbnail:false,
        allowedAttempts:2,
        captiontext:"Proin gravida",
        queImageWidth:200,
        queImageHeight:200,
        allowAnsImages:true,
        answers:[{
            ansImg:"images/a.png",
            ansImgHeight:100,
            ansImgWidth:100,
            text : "Nisi elit consequat ipsum.",
            correct : false
        },
        {
            ansImg:"images/a.png",
            ansImgHeight:100,
            ansImgWidth:100,
            text : "Nec sagittis sem nibh id elit.",
            correct : false
        },
        {
            ansImg:"images/a.png",
            ansImgHeight:100,
            ansImgWidth:100,
            text : "Duis sed odio sit amet.",
            correct : true
        },
        {
            ansImg:"images/a.png",
            ansImgHeight:100,
            ansImgWidth:100,
            text : "Nibh vulputate cursus a sit amet mauris.",
            correct : false
        }],
        feedBackText : {
            datacorrect : "<span>That's right!</span> Morbi accumsan ipsum velit. Nam nec tellus!",
            incorrect: "<span>Uhh no.</span> Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit?",
            remFeedback:"Here is the correct answer!"
        }
    },
    {
        question: "<p>Duis aute irure dolor in reprehenderit in voluptate?",
        queImage:"images/a.png",
        allowCaption:false,
        captiontext:"Proin gravida",
        allowedAttempts:2,
        queImageWidth:200,
        queImageHeight:200,
        allowAnsImages:false,
        answers:[{
            text : "Sed ut perspiciatis unde omnis iste.",
            correct : false
        },
        {
            text : "At vero eos et accusamus et iusto odio.",
            correct : true
        },
        {
            text : "Dignissimos ducimus qui blanditiis praesentium.",
            correct : false
        },
        {
            text : "Avoluptatum deleniti atque corrupti.",
            correct : true
        }],
        feedBackText:{
            datacorrect : "<span>Nice!</span> Similique sunt in culpa qui officia deserunt mollitia animi.",
            incorrect: "<span>Hmmm.</span> Et harum quidem rerum facilis est et expedita.",
            remFeedback:"Here is the correct answer!"
        }
    },
    {
        question: "<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        queImage:"",
        queImageThumbnail:false,
        allowCaption:false,
        captiontext:"Proin gravida",
        allowedAttempts:2,
        queImageWidth:100,
        queImageHeight:200,
        allowAnsImages:false,
        answers:[{
            text : "Doloremque laudantium, totam rem.",
            correct : true
        },
        {
            text : "At vero eos et accusamus et iusto odio.",
            correct : false
        },
        {
            text : "Ablanditiis praesentium voluptatum deleniti atque.",
            correct : true
        },
        {
            text : "I corrupti quos dolores et quas molestias",
            correct : true
        }],
        feedBackText:{
            datacorrect : "<span>Brilliant!</span> Excepturi sint occaecati cupiditate non provident.",
            incorrect: "<span>Not Quite.</span> similique sunt in culpa qui officia deserunt.",
            remFeedback:"Here is the correct answer!"
        }
    },
    {
        question: "<p>Imollitia animi, id est laborum et dolorum fuga?",
        queImage:"",
        queImageThumbnail:false,
        allowCaption:false,
        captiontext:"Proin gravida",
        allowedAttempts:2,
        queImageWidth:100,
        queImageHeight:200,
        allowAnsImages:false,
        answers:[{
            text : "Et harum quidem rerum.",
            correct : true
        },
        {
            text : "Facilis est et.",
            correct : false
        }],
        feedBackText:{
            datacorrect : "<span>Good!</span> Yexpedita distinctio. Nam libero tempore!",
            incorrect: "<span>ERR!</span> Wcum soluta nobis est eligendi optio?",
            remFeedback:"Here is the correct answer!"
        }
    }],
    resultContent: "<p>Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. </p>",
    retultResetButtonText:"Start Over"
};