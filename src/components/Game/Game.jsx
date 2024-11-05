import React, { useState, useEffect, useRef } from "react";

import { getImageUrl } from "../../utils";
import { RULE_TEXT1, RULE_TEXT2, PAYPAL_TEXT } from "../../text/Information";
import db, { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged} from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { format, toZonedTime } from 'date-fns-tz';
import { generateMathQuestion, generateWordUnscrambleQuestion, getWordToUnscramble, generateMathSequenceQuestion, translateNumToStr } from "../../helpers/QuestionHelper";
import { evaluate } from "mathjs";
import styles from "./Game.module.css";

export const Game = () => {
  //Modals
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [contactUsModalVisible, setContactUsModalVisible] = useState(false);
  const [transferBalanceModalVisible, setTransferBalanceModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  //const [verifyHumanModalVisible, setVerifyHumanModalVisible] = useState(false);

  //Log in Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [messageArray, setMessageArray] = useState(() => {
    const savedMessageArray = localStorage.getItem("messageArray");
    return savedMessageArray ? JSON.parse(savedMessageArray) : [];
  })
  const [alertMessage, setAlertMessage] = useState('');

  //Dates
  const [todayFriendly, setTodayFriendly] = useState('');

  //Game Data
  const [submissionCount, setSubmissionCount] = useState(() => {
    const savedSubmissionCount = localStorage.getItem("submissionCount");
    return savedSubmissionCount ? JSON.parse(savedSubmissionCount) : 0;
  })
  const [submitClass, setSubmitClass] = useState(styles.submitButton);
  const [randomAdNum, setRandomAdNum] = useState(() => {
    const randNum = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    return randNum;
  });
  const [total, setTotal] = useState(0);
  const [leaderTotal, setLeaderTotal] = useState(0);
  const [userTotal, setUserTotal] = useState(() => {
    const savedScore = localStorage.getItem("userTotal");
    return savedScore ? JSON.parse(savedScore) : 0;
  })
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem("balance");
    return savedBalance ? JSON.parse(savedBalance) : 0;
  })
  const [payout, setPayout] = useState(0);
  const [questionType, setQuestionType] = useState(() => {
    const savedQuestionType = localStorage.getItem("questionType");
    return savedQuestionType ? JSON.parse(savedQuestionType) : '';
  })
  const [wordToUnscramble, setWordToUnscramble] = useState(() => {
    const savedwordToUnscramble = localStorage.getItem("wordToUnscramble");
    return savedwordToUnscramble ? JSON.parse(savedwordToUnscramble) : '';
  })
  const [sequenceAnswer, setSequenceAnswer] = useState(() => {
    const savedSequenceAnswer = localStorage.getItem("sequenceAnswer");
    return savedSequenceAnswer ? JSON.parse(savedSequenceAnswer) : '';
  })
  const [questionPrompt, setQuestionPrompt] = useState(() => {
    const savedQuestionPrompt = localStorage.getItem("questionPrompt");
    return savedQuestionPrompt ? JSON.parse(savedQuestionPrompt) : '';
  })
  const [questionString, setQuestionString] = useState(() => {
    const savedQuestionString = localStorage.getItem("questionString");
    return savedQuestionString ? JSON.parse(savedQuestionString) : '';
  })
  const [question, setQuestion] = useState(() => {
    const savedQuestion = localStorage.getItem("question");
    return savedQuestion ? JSON.parse(savedQuestion) : '';
  })
  const [inputAnswer, setInputAnswer] = useState('');

  /*Human Verification
  const [verifyHumanText, setVerifyHumanText] = useState('');
  const [verifyHumanAnswer, setVerifyHumanAnswer] = useState(0);
  const [verifyHumanAttemptsRemaning, setVerifyHumanAttemptsRemaining] = useState(3);
  const [disabled, setDisabled] = useState(false);
  const [verifyHumanInput, setVerifyHumanInput] = useState(''); */

  //Animations
  const [correctAnimation, setCorrectAnimation] = useState(false);
  const [incorrectAnimation, setIncorrectAnimation] = useState(false);

  //Contact Us
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  //Transfer Balance
  const [payPalEmail, setPayPalEmail] = useState('');
  const [payPalConfirmEmail, setPayPalConfirmEmail] = useState('');

  //Refs
  const inputRef = useRef(null);

  //Use Effects
  //ExoClick
  //Native
  useEffect(() => {
    // Select the footer and ensure it exists
    const footer = document.querySelector('footer');
    if (!footer) return;
  
    // Create and append the ad container
    const adDiv = document.createElement('ins');
    adDiv.className = 'eas6a97888e20';
    adDiv.setAttribute('data-zoneid', '5456088');
  
    // Insert the ad container above the footer
    footer.parentNode.insertBefore(adDiv, footer);
  
    // Add the ad provider script to load the ad
    const script = document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = 'https://a.magsrv.com/ad-provider.js';
    footer.parentNode.insertBefore(script, adDiv);
  
    // Load the ad after both elements are in place
    const initAdScript = document.createElement('script');
    initAdScript.innerHTML = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
    footer.parentNode.insertBefore(initAdScript, footer);

    // Ensure footer remains below ad
    adDiv.style.marginBottom = '10px'; // Add spacing between ad and footer
  
    // Clean up the ad elements when component unmounts
    return () => {
      footer.parentNode.removeChild(adDiv);
      footer.parentNode.removeChild(script);
      footer.parentNode.removeChild(initAdScript);
    };
  }, []);

  //Banner Ads
  useEffect(() => {
    // Determine if the device is mobile or desktop based on screen width
    const isMobile = window.innerWidth < 768;
    const adContainerId = isMobile ? 'mobile-banner-ad' : 'desktop-banner-ad';
    const adClass = isMobile ? 'eas6a97888e10' : 'eas6a97888e2';
    const zoneId = isMobile ? '5455994' : '5457138';

    // Create ad elements
    const script = document.createElement('script');
    script.async = true;
    script.type = "application/javascript";
    script.src = "https://a.magsrv.com/ad-provider.js";

    const adContainer = document.createElement('ins');
    adContainer.className = adClass;
    adContainer.dataset.zoneid = zoneId;

    const adScript = document.createElement('script');
    adScript.innerHTML = '(AdProvider = window.AdProvider || []).push({"serve": {}});';

    // Append ad elements to the specified container
    const adElement = document.getElementById(adContainerId);
    adElement.appendChild(script);
    adElement.appendChild(adContainer);
    adElement.appendChild(adScript);

    // Cleanup
    return () => {
      adElement.innerHTML = ''; // Remove ad elements on unmount
    };
  }, []);
  
  
  const lastSignedInEmail = localStorage.getItem("lastSignedInEmail");

  useEffect(() => {
    if (lastSignedInEmail) {
      setEmail(lastSignedInEmail); // Assuming `setEmailInput` is your email state setter
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("submissionCount", JSON.stringify(submissionCount));
  }, [submissionCount]);

  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("messageArray", JSON.stringify(messageArray));
  }, [messageArray]);

  useEffect(() => {
    localStorage.setItem("userTotal", JSON.stringify(userTotal));
  }, [userTotal]);


  useEffect(() => {
    localStorage.setItem("questionType", JSON.stringify(questionType));
  }, [questionType]);

  useEffect(() => {
    localStorage.setItem("wordToUnscramble", JSON.stringify(wordToUnscramble));
  }, [wordToUnscramble]);

  useEffect(() => {
    localStorage.setItem("sequenceAnswer", JSON.stringify(sequenceAnswer));
  }, [sequenceAnswer]);

  useEffect(() => {
    localStorage.setItem("questionPrompt", JSON.stringify(questionPrompt));
  }, [questionPrompt]);

  useEffect(() => {
    localStorage.setItem("questionString", JSON.stringify(questionString));
  }, [questionString]);

  useEffect(() => {
    localStorage.setItem("question", JSON.stringify(question));
  }, [question]);

  //Main useEffect
  useEffect(() => {

    const initialize = async () => {
      const timeZone = 'America/Chicago';
      const now = new Date();
      const centralTime = toZonedTime(now, timeZone);
      const formattedDate = format(centralTime, 'yyyy MM dd');
      const formattedDate2 = format(centralTime, 'MMM dd');
  
      // Load question
      if (!question) {
        setQuestion(generateQuestion());
      }
  
      // Load Payout, Leader total, and overall total
      getGameStats(formattedDate);
  
      // Firebase listener to check if a user is logged in
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, get their UID
          setSignedIn(true);
          setUserId(user.uid);

          // Load user-specific data
          loadUserData(user.uid, formattedDate);

          try {
            // Fetch last update and handle cutover if needed
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            let lastUpdate;
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              lastUpdate = data.lastUpdate;
            }

            if (lastUpdate !== formattedDate) {
              handleCutover(formattedDate, formattedDate2);
            }
          } catch (error) {
            console.error("Error fetching user data or handling cutover:", error);
          }
        }  else {
          // User is signed out
          setSignedIn(false);
          setUserId(null);
          setUserTotal(0);
        }
      });
  
      setTodayFriendly(formattedDate2);
  
      // Clean up the listener on component unmount
      return () => unsubscribe();
    };
  
    initialize();
  }, []);
  

  const loadUserData = async (uid, formattedDate) => {

    // Get user total from the database
    const userDocRef = doc(db, 'dates/' + formattedDate + '/users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserTotal(data.userTotal);
    } else {
      setUserTotal(0);
    }
    

    // Load messages from the database
    if (messageArray.length === 0) {
      const messageArrayLocal = [];
      const messagesRef = collection(db, 'users/' + uid + '/messages');
      const dateSnapshots = await getDocs(messagesRef);
      dateSnapshots.forEach((dateDoc) => {
        const messageData = dateDoc.data();
        if (messageData.lotteryMessage) {
          messageArrayLocal.push(messageData.lotteryMessage);
        }
        if (messageData.highScoreMessage) {
          messageArrayLocal.push(messageData.highScoreMessage);
        }
        if (messageData.transferBalanceMessage) {
          messageArrayLocal.push(messageData.transferBalanceMessage);
        }
      });
      setMessageArray(messageArrayLocal);
    }

    // Load user balance
    const balanceDocRef = doc(db, 'users', uid);
    const balanceDocSnap = await getDoc(balanceDocRef);
    if (balanceDocSnap.exists()) {
      const balanceData = balanceDocSnap.data();
      setBalance(balanceData.highScoreBalance + balanceData.lotteryBalance);
    }
  };

  //get User Id
  const getUserId = () => {
    return new Promise((resolve, reject) => {
      if (userId) {
        // If userId is already set in the state, resolve with it
        resolve(userId);
      } else {
        // Use onAuthStateChanged to retrieve user if userId is not in the state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe(); // Unsubscribe immediately after getting the user
          if (user) {
            setUserId(user.uid); // Save userId to state
            resolve(user.uid); // Resolve with userId
          } else {
            reject(new Error("User is not signed in"));
          }
        });
      }
    });
  };

  //Close Modals

  const closeAlertModalVisible = () => {
    setAlertModalVisible(false);
  }

  const closeMessageModal = () => {
    setMessageModalVisible(false);
  }

  const closeTransferBalanceModal = () => {
    setTransferBalanceModalVisible(false);
  }

  const closeInfoModal = () => {
    setInfoModalVisible(false);
  }

  const closeContactUsModal = () => {
    setContactUsModalVisible(false);
  }

  //Message Modal
  const messageModalClicked = async () => {
    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');
    const formattedDate2 = format(centralTime, 'MMM dd');

    var lastUpdate;
    const uid = await getUserId();
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef); // Await Firestore call
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      lastUpdate = data.lastUpdate;
    } 

    if (lastUpdate != formattedDate) {
      handleCutover(formattedDate, formattedDate2);
    }
    
    setMessageModalVisible(true);
  
  }

  //Transfer Balance
  const handleClickTransferBalance = () => {
    if (!signedIn) {
      setAlertMessage("Please sign in to transfer an existing balance");
      setAlertModalVisible(true);
      return;
    }
    setTransferBalanceModalVisible(true);
  }

  const handleRequestPayout = async () => {
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Please check your connection");
      setAlertModalVisible(true);
      return;
    }
    // Validation
    if (balance < 20) {
      setAlertMessage("Your balance must be $20 or greater to request a payout.");
      setAlertModalVisible(true);
      return;
    } 
    if (!payPalEmail) {
      setAlertMessage("Please enter the email account associated with your PayPal account.");
      setAlertModalVisible(true);
      return;
    }

    if (!isValidEmail(payPalEmail)) {
      setAlertMessage("Please enter a valid email address.");
      setAlertModalVisible(true);
      return;
    }

    if (payPalEmail != payPalConfirmEmail) {
      setAlertMessage("The email accounts do not match.");
      setAlertModalVisible(true);
      return;
    }

    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');
    const formattedDate2 = format(centralTime, 'MMM dd');
    const formattedDate3 = format(centralTime, 'MMM dd yyyy');

    var lastUpdate;
    const uid = await getUserId();
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef); // Await Firestore call
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      lastUpdate = data.lastUpdate;
    } 
    if (lastUpdate != formattedDate) {
      handleCutover(formattedDate, formattedDate2);
    }

    const userEmail = email ? email : auth.currentUser ? auth.currentUser.email : "";
    addDoc(collection(db, 'requests/' + formattedDate + '/' + uid),  {
      paypalEmail: payPalEmail,
      email: userEmail,
      balance: balance,
    })
    

    setDoc(userDocRef, {
      highScoreBalance: 0,
      lotteryBalance: 0
    }, {merge: true});

    //Add message
    var transferBalanceMessage = formattedDate3 + ": You requested a payout of $" + balance + "."
    var tempMessageArray = messageArray;
    tempMessageArray.push(transferBalanceMessage);
    setMessageArray(tempMessageArray);
    setBalance(0);

    var docRef = doc(db, 'users/' + userId + "/messages/" + formattedDate);
    setDoc(docRef, {
      transferBalanceMessage: transferBalanceMessage
    }, {merge: true});

    setAlertMessage("Payout request received. If you do not receive payment in 1-3 business days, please contact us.");
    setAlertModalVisible(true);
    setTransferBalanceModalVisible(false);
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //Contact Us
  const handleClickContact = () => {
    if (!signedIn) {
      setAlertMessage("Please sign in to contact us");
      setAlertModalVisible(true);
      return;
    }
    setContactUsModalVisible(true);
  }

  const handleSendMessage = async () => {
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Please check your connection");
      setAlertModalVisible(true);
      return;
    }

    if (!subject) {
      setAlertMessage("Please enter a subject");
      setAlertModalVisible(true);
      return;
    }

    if (!message) {
      setAlertMessage("Please enter a message");
      setAlertModalVisible(true);
      return;
    }

    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');
    const formattedDate2 = format(centralTime, 'MMM dd');

    var lastUpdate;
    const uid = await getUserId();
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef); // Await Firestore call
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      lastUpdate = data.lastUpdate;
    } 

    if (lastUpdate != formattedDate) {
      handleCutover(formattedDate, formattedDate2);
    }
    const userEmail = email ? email : auth.currentUser ? auth.currentUser.email : "";
    addDoc(collection(db, 'feedback/' + formattedDate + '/' + uid), {
      subject: subject,
      message: message,
      userId: uid,
      email: userEmail
    })

    setAlertMessage("Thanks for your message!");
    setAlertModalVisible(true);
    setContactUsModalVisible(false);
    setSubject('');
    setMessage('');
  }

  //Refresh
  const handleRefresh = async () => {

    inputRef.current.focus();

    //Check if new date
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Please check your connection");
      setAlertModalVisible(true);
      return;
    }

    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');
    const formattedDate2 = format(centralTime, 'MMM dd');

    // Update highscore, total, and payout
    await getGameStats(formattedDate);

    let uid;
    try {
      uid = await getUserId();
    } catch (error) {
      console.log("User is not signed in:", error.message);
      return; // Exit if user is not signed in
    }

    var lastUpdate;
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef); // Await Firestore call
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      lastUpdate = data.lastUpdate;
    } 

    if (lastUpdate !== formattedDate) {
      handleCutover(formattedDate, formattedDate2);
      return;
    }

    //Update user total - possible to be out of sync if on different devices
    var dateUserDocRef = doc(db, 'dates/' + formattedDate + '/users', uid);
    const dateUserDocSnap = await getDoc(dateUserDocRef);
    if (dateUserDocSnap.exists()) {
      var dateUserData = dateUserDocSnap.data();
      setUserTotal(dateUserData.userTotal);
    }
    else 
    {
      setUserTotal(0);
    }
    //Actually refresh page
    location.reload();
  }

  const handleRefreshOnCorrect = async (formattedDate, newUserTotal) => {

    inputRef.current.focus();

    const uid = await getUserId();
    var userDocRef = doc(db, 'dates/' + formattedDate + '/users', uid);
    setDoc(userDocRef, {
      userTotal: newUserTotal
    }, {merge: true});

    var datesDocRef = doc(db, 'dates', formattedDate);
    getDoc(datesDocRef).then(docSnap => {
      if (docSnap.exists()) {
        var data = docSnap.data();
        var currentHighScore = data.highScore;
        if (newUserTotal > currentHighScore) {
          setDoc(datesDocRef, {
            highScore: newUserTotal,
            user: uid
          }, {merge: true});
          setLeaderTotal(newUserTotal);
        }
        else {
          setLeaderTotal(currentHighScore);
        }
        var currentTotal = data.total;
        setDoc(datesDocRef, {
          total: currentTotal + 1
        }, {merge: true});
        setTotal(currentTotal + 1);
      }
    })
  }
  /*Human Verification
  const verifyHumanGenerateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    const num1Str = translateNumToStr(num1);
    const num2Str = translateNumToStr(num2);
    setVerifyHumanAnswer(num1+num2);

    var text = "What is " + num1Str + " plus " + num2Str + "?"
    setVerifyHumanText(text);
    setVerifyHumanModalVisible(true);
  }

  const verifyHuman = () => {
    alert("Excuse me?")
    if (verifyHumanInput === verifyHumanAnswer) {
      setAlertMessage("Thank you for verifying");
      setAlertModalVisible(true);
      setVerifyHumanModalVisible(false);
      setVerifyHumanInput('');
      inputRef.current.focus();
      return;
    }

    var attemptsRemaining = verifyHumanAttemptsRemaning - 1;
    if (verifyHumanAttemptsRemaning <= 0) {
      setAlertMessage("Incorrect response. Verification failed. Please try again tomorrow");
      setAlertModalVisible(true);
      return;
    }
    alert("Excuse me 2?")
    setAlertMessage("Incorrect response. You have " + attemptsRemaining + " attempts remaining.")
    setAlertModalVisible(true);
    setVerifyHumanAttemptsRemaining(attemptsRemaining);
  } */

  //Math Functions
  function generateQuestion() {
    var retVal = ''; 
    var questionTypeLocal = getRandomInt(2);
    setQuestionType(questionTypeLocal);

    switch (questionTypeLocal) {
      case 0:
        setQuestionPrompt("Solve the math equation!")
        retVal = generateMathQuestion();
        setQuestionString(getMathQuestionString(retVal));
        break;
      case 1:
        setQuestionPrompt("Unscramble the word!")
        var word = getWordToUnscramble();
        setWordToUnscramble(word);
        retVal = generateWordUnscrambleQuestion(word);
        setQuestionString(retVal);
        break;
      case 2:
        setQuestionPrompt("Determine the next number in the sequence!")
        var { sequence, answer} = generateMathSequenceQuestion();
        setSequenceAnswer(answer);
        retVal = sequence;
        setQuestionString(getMathSequenceQuestionString(retVal));
        break;
      default:
        break;
    }

    return retVal; 
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getMathQuestionString(thingToStringify) {
    var outputQuestion = '';
    outputQuestion = thingToStringify.split('*').join('x');
    return outputQuestion;
  }

  function getMathSequenceQuestionString(thingToStringify) {
    var outputQuestion = '';
    for (let i = 0; i < 3; ++i) {
      outputQuestion = outputQuestion + + thingToStringify[i] + ", ";
    }
    outputQuestion = outputQuestion + thingToStringify[3];
    return outputQuestion;
  }

  //Handle Answer

  const handleSubmit = async (e) => {
    e.preventDefault();

    const captchaResponse = grecaptcha.getResponse();
    
    if (!captchaResponse) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: "POST",
        body: params,
      });
      const data = await res.json();

      if (data.captchaSuccess) {
        alert("Validation Successful");
        handleSubmitAnswer(); // Calls your custom answer submission logic
      } else {
        alert("Validation failed");
      }
    } catch (err) {
      alert("An error occurred: " + err);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Please check your connection");
      setAlertModalVisible(true);
      return;
    }

    if (!signedIn) {
      setAlertMessage("Please sign in to start logging your points");
      setAlertModalVisible(true);
      return;
    }

    //Show ad
    const newCount = submissionCount + 1;
    setSubmissionCount(newCount);

    let adDisplayed = false;

    if (newCount >= randomAdNum) {
      setSubmitClass(styles.interstitial);
      const event = new MouseEvent('click', { bubbles: true });
      const interstitialLink = document.querySelector('.interstitial');
      if (interstitialLink) {
        interstitialLink.dispatchEvent(event);
      }
      setSubmitClass(styles.submitButton);
      setSubmissionCount(0);
      setRandomAdNum(Math.floor(Math.random() * (20 - 10 + 1) + 10));

      adDisplayed = true;
    }

    // Function to check if the ad is closed
    const checkAdClosed = () => {
      const adElement = document.querySelector('.interstitial');  // Adjust if the ad uses a different selector
      if (!adElement) {
          clearInterval(adCheckInterval);
          location.reload();
      }
    };

  // Poll every second to see if ad has closed
    if (adDisplayed) {
      const adCheckInterval = setInterval(checkAdClosed, 1000);
    }

    //Auto-focus on input field
    inputRef.current.focus();

    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');
    const formattedDate2 = format(centralTime, 'MMM dd');

    var lastUpdate;
    const uid = await getUserId();
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef); // Await Firestore call
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      lastUpdate = data.lastUpdate;
    } 

    if (lastUpdate != formattedDate) {
      handleCutover(formattedDate, formattedDate2);
    }

    //Math Question
    if (questionType == 0) {
      var result = evaluate(question);
      //alert(result);
      if (inputAnswer == result) {
        //Correct
        handleCorrect(formattedDate);
      }
      else {
        //Incorrect
        handleIncorrect();
      }
    }
    
    //Word Unscramble Question
    if (questionType == 1) {
      //alert(wordToUnscramble);
      if (inputAnswer.trim().toLowerCase() == wordToUnscramble) {
        handleCorrect(formattedDate);
      }
      else {
        handleIncorrect();
      }
    }

    if (refresh) {
      // Use a delay to allow the ad to display before refreshing the page
      setTimeout(() => {
        location.reload();
      }, 5000);  // Adjust this delay based on ad display time
    }
  }

  const handleCutover = async (formattedDate, dateFriendly, skipUserData) => {
    setAlertMessage("A new day has started");
    setAlertModalVisible(true);
    setUserTotal(0);

    var datesDocRef = doc(db, 'dates', formattedDate);
    const dateDocSnap = await getDoc(datesDocRef);
    if (dateDocSnap.exists()) {
      var data = dateDocSnap.data();
      setLeaderTotal(data.highScore);
      setTotal(data.total);
      setTodayFriendly(dateFriendly);
    }
    else {
      setAlertMessage("Cutover to new day has not completed. Please wait a few moments and try again.");
      setAlertModalVisible(true);
    }

    if (skipUserData) {
      return;
    }

    //Balance
    const uid = await getUserId();
    var userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      var balanceData = userDocSnap.data();
      setBalance(balanceData.highScoreBalance + balanceData.lotteryBalance);
    }

    // Set Last update
    await setDoc(userDocRef, {
      lastUpdate: formattedDate
    }, { merge: true });

    //Get new messages
    const messageArrayLocal = [];
    const messagesRef = collection(db, 'users/' + uid + '/messages');
    const dateSnapshots = await getDocs(messagesRef);
    dateSnapshots.forEach((dateDoc) => {
      const messageData = dateDoc.data();
      if (messageData.lotteryMessage) {
        messageArrayLocal.push(messageData.lotteryMessage);
      }
      if (messageData.highScoreMessage) {
        messageArrayLocal.push(messageData.highScoreMessage);
      }
      if (messageData.transferBalanceMessage) {
        messageArrayLocal.push(messageData.transferBalanceMessage);
      }
    });
    setMessageArray(messageArrayLocal);
  }

  const handleCorrect = async (formattedDate) => {
    var newUserTotal = userTotal + 1;
    
    const uid = await getUserId();
    var dateUserDocRef = doc(db, 'dates/' + formattedDate + '/users', uid);
    const dateUserDocSnap = await getDoc(dateUserDocRef);
    if (dateUserDocSnap.exists()) {
      var dateUserData = dateUserDocSnap.data();
      newUserTotal = dateUserData.userTotal + 1;
    }

    setCorrectAnimation(true);
    setTimeout(() => {
      setCorrectAnimation(false);

      setTimeout(() => {
        setUserTotal(newUserTotal);
        setQuestion(generateQuestion);
        setInputAnswer('');
      }, 200);
    }, 800);

    handleRefreshOnCorrect(formattedDate, newUserTotal);
  }

  const handleIncorrect = () => {
    setIncorrectAnimation(true);
    setTimeout(() => setIncorrectAnimation(false), 600);
    setInputAnswer('');
  }


  //Firebase Functions
  const getGameStats = async (formattedDate) => {

    const datesDocRef = doc(db, 'dates', formattedDate);
    const docSnap = await getDoc(datesDocRef);
    
    if (docSnap.exists()) {
      var data = docSnap.data();
      //Payout
      setPayout(data.payout);

      //Overall Total
      setTotal(data.total);

      //Leader Total
      setLeaderTotal(data.highScore);
    }
  }

  //Authentication Functions

  const handleLogIn = async () => {
    try {
      if (!navigator.onLine) {
        setAlertMessage("You are offline. Please check your connection");
        setAlertModalVisible(true);
        return;
      }
      if (!email) {
        setAlertMessage("Please enter a valid email");
        setAlertModalVisible(true);
        return;
      }
      if (!password) {
        setAlertMessage("Please enter a password");
        setAlertModalVisible(true);
        return;
      }
  
      // Use async/await for sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserId(user.uid);
      setSignInModalVisible(false);
      setSignedIn(true);
      setPassword('');
      setAlertMessage("You have successfully signed in");
      setAlertModalVisible(true);
      localStorage.removeItem("lastSignedInEmail");
  
      // Refresh game stats
      const timeZone = 'America/Chicago';
      const now = new Date();
      const centralTime = toZonedTime(now, timeZone);
      const formattedDate = format(centralTime, 'yyyy MM dd');
      const formattedDate2 = format(centralTime, 'MMM dd');
      setTodayFriendly(formattedDate2);
  
      getGameStats(formattedDate); // Await the async call
  
      // User Score
      const userDateDocRef = doc(db, 'dates/' + formattedDate + '/users', user.uid);
      const userDateDocSnap = await getDoc(userDateDocRef); // Await Firestore call
      if (userDateDocSnap.exists()) {
        const data = userDateDocSnap.data();
        setUserTotal(data.userTotal);
      } else {
        setUserTotal(0);
      }
  
      // User Balance
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef); // Await Firestore call
      const balanceData = userDocSnap.data();
      setBalance(balanceData.highScoreBalance + balanceData.lotteryBalance);

      // Last update
      await setDoc(userDocRef, {
        lastUpdate: formattedDate
      }, { merge: true });
  
      // Message
      const messageArrayLocal = [];
      const messagesRef = collection(db, 'users/' + user.uid + '/messages');
      const dateSnapshots = await getDocs(messagesRef); // Await Firestore call
      dateSnapshots.forEach((dateDoc) => {
        const messageData = dateDoc.data();
        if (messageData.accountCreationMessage) messageArrayLocal.push(messageData.accountCreationMessage);
        if (messageData.lotteryMessage) messageArrayLocal.push(messageData.lotteryMessage);
        if (messageData.highScoreMessage) messageArrayLocal.push(messageData.highScoreMessage);
        if (messageData.transferBalanceMessage) messageArrayLocal.push(messageData.transferBalanceMessage);
      });
      setMessageArray(messageArrayLocal);
      
    } catch (error) {
      let errorMessage = error.message;
      if (errorMessage.includes("invalid-email")) {
        errorMessage = "The email entered is not valid";
      } else if (errorMessage.includes("user-not-found")) {
        errorMessage = "The email does not have a registered account";
      } else if (errorMessage.includes("wrong-password")) {
        errorMessage = "Invalid credentials";
      }
      setAlertMessage(errorMessage);
      setAlertModalVisible(true);
    }
  };

  const handleCreateAccount = async () => {
    try {
      if (!navigator.onLine) {
        setAlertMessage("You are offline. Please check your connection");
        setAlertModalVisible(true);
        return;
      }
      if (!registerEmail || !isValidEmail(registerEmail)) {
        setAlertMessage("Please enter a valid email address");
        setAlertModalVisible(true);
        return;
      }
  
      if (!registerPassword) {
        setAlertMessage("Please enter a password");
        setAlertModalVisible(true);
        return;
      }
      if (!registerConfirmPassword) {
        setAlertMessage("Please confirm your password");
        setAlertModalVisible(true);
        return;
      }
      if (registerPassword !== registerConfirmPassword) {
        setAlertMessage("The passwords do not match");
        setAlertModalVisible(true);
        return;
      }
  
      setEmail(registerEmail);
  
      // Register the account with Firebase
      const userCredentials = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredentials.user;

      const timeZone = 'America/Chicago';
      const now = new Date();
      const centralTime = toZonedTime(now, timeZone);
      const formattedDate = format(centralTime, 'yyyy MM dd');
      const formattedDate2 = format(centralTime, 'MMM dd yyyy');
  
      // Create a user document in Firestore
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        id: user.uid,
        email: registerEmail,
        highScoreBalance: 0,
        lotteryBalance: 0,
        lastUpdate: formattedDate
      });
  
      setUserId(user.uid);
      setRegisterModalVisible(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
  
      // Add "account created" message
      const accountCreationMessage = `${formattedDate2}: Account created.`;
      const tempMessageArray = [];
      tempMessageArray.push(accountCreationMessage);
      setMessageArray(tempMessageArray);
      setBalance(0);
  
      const messageDocRef = doc(db, 'users/' + user.uid + "/messages/" + formattedDate);
      await setDoc(messageDocRef, { accountCreationMessage }, { merge: true });
  
      // Auto sign in the user
      await signInWithEmailAndPassword(auth, registerEmail, registerPassword);
      setSignedIn(true);
      setInfoModalVisible(true);
      setAlertMessage("You have successfully created an account");
      setAlertModalVisible(true);


  
      // Refresh game stats
      getGameStats(formattedDate);
  
    } catch (error) {
      let errorMessage = error.message;
      if (errorMessage.includes("email-already-in-use")) {
        errorMessage = "This email is already associated with an account";
      } else if (errorMessage.includes("invalid-email")) {
        errorMessage = "The email entered is not valid";
      } else if (errorMessage.includes("user-not-found")) {
        errorMessage = "The email does not have a registered account";
      } else if (errorMessage.includes("lower case")) {
        errorMessage = "Password must contain a lower case character";
      } else if (errorMessage.includes("uppper case")) {
        errorMessage = "Password must contain an upper case character";
      } else if (errorMessage.includes("6 characters")) {
        errorMessage = "Password must contain at least 6 characters";
      } else if (errorMessage.includes("numeric")) {
        errorMessage = "Password must contain a numeric character";
      }

      setAlertMessage(errorMessage);
      setAlertModalVisible(true);
    }
  };
  

  const showForgotPasswordModal = () => {
    setForgotPasswordModalVisible(true);
  }

  const handleForgotPassword = () => {
    if (!forgotPasswordEmail) {
      setAlertMessage("Please enter a valid email");
      setAlertModalVisible(true);
      return;
    }
    sendPasswordResetEmail(auth, forgotPasswordEmail)
      .then(() => {
        setForgotPasswordModalVisible(false);
        setAlertMessage("Password reset link sent to your email. The email will come from noreply@do-math-make-money-ce133.firebaseapp.com");
        setAlertModalVisible(true);
      })
      .catch(error => {
        var errorMessage = error.message;
        if (errorMessage.includes("invalid-email")) {
          errorMessage = "The email entered is not valid";
        }
        else if (errorMessage.includes("user-not-found")) {
          errorMessage = "The email does not have a registered account"
        }
        setAlertMessage(errorMessage);
        setAlertModalVisible(true);
      });
  }

  const handleSignOut = async () => {
    try {
      const userEmail = auth.currentUser ? auth.currentUser.email : null;
      if (userEmail) {
        localStorage.setItem("lastSignedInEmail", userEmail);
      }

      await signOut(auth);
      setSignedIn(false);
      setUserTotal(0);
      setBalance(0);
      setAlertMessage("You have successfully signed out");
      setAlertModalVisible(true);
  
      const timeZone = 'America/Chicago';
      const now = new Date();
      const centralTime = toZonedTime(now, timeZone);
      const formattedDate = format(centralTime, 'yyyy MM dd');
      const formattedDate2 = format(centralTime, 'MMM dd');
  
      const uid = await getUserId();
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
  
      let lastUpdate;
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        lastUpdate = data.lastUpdate;
      }
  
      if (lastUpdate !== formattedDate) {
        handleCutover(formattedDate, formattedDate2, true);
      }

    } catch (error) {
      setAlertMessage(error.message);
      setAlertModalVisible(true);
    }
  };
  
  return (
    <section className={styles.container}>
      <div className={styles.bannerAd}>
        <div id="mobile-banner-ad" style={{ display: window.innerWidth < 768 ? 'block' : 'none' }} />
        <div id="desktop-banner-ad" style={{ display: window.innerWidth >= 768 ? 'block' : 'none' }} />
      </div>
      <header className={styles.header}>
        <div className={styles.leftHeader}>
          <p className={styles.title}>Brain Bucks</p>
          <img src={getImageUrl("logo.png")} alt="Logo" className={styles.logo}/>
        </div>
        <div className={styles.rightHeader}>

          {/* If not signed in, show Sign In and Register Buttons*/}
          {!signedIn && (
          <>
            <button 
              className={styles.signIn}
              onClick={() => setSignInModalVisible(true)}>Sign In</button>
            <button 
              className={styles.register}
              onClick={() => setRegisterModalVisible(true)}>Register</button>
          </>
          )}

          {signedIn && (
            <>
              <button 
                className={styles.signOut}
                onClick={handleSignOut}>Sign Out</button>
              <img 
                src={getImageUrl("email.png")} 
                alt="History" 
                title="History"
                className={styles.email}
                onClick={messageModalClicked}/>
            </>
          )}
          
          <img 
            src={getImageUrl("info.png")} 
            alt="Information" 
            title="Information"
            className={styles.info}
            onClick={() => setInfoModalVisible(true)}/>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.topSection}>
          <div className={styles.topSectionLeft}>
            <p className={styles.topSectionLeftText}>Total: {total}</p>
            <p className={styles.topSectionLeftText}>Leader: {leaderTotal}</p>
            <p className={styles.topSectionLeftText}>You: {userTotal}</p>
            <p className={styles.topSectionLeftText}>Balance: ${balance}</p>
          </div>
          <div className={styles.topSectionRight}>
            <a 
              href="#"
              className={`${styles.refreshButton} interstitial`} 
              onClick={(e) => {
                e.preventDefault(); // Prevents link navigation
                handleRefresh();
              }}
            >
              Refresh
            </a>
            <button 
              className={styles.topSectionRightButton}
              onClick={handleClickTransferBalance}>Transfer Balance</button>
            <button 
              className={styles.topSectionRightButton}
              onClick={handleClickContact}>Contact</button>
          </div>
        </div>
        <div className={styles.mainSection}>
          <img src={getImageUrl("logo.png")} alt="Logo" className={styles.mainLogo}/>
          <p className={styles.mainSectionText}>Prize Pool for {todayFriendly}: ${payout}</p>
          <p className={styles.mainSectionText}>{questionPrompt}</p>
          <p className={correctAnimation ? styles.tada : incorrectAnimation ? styles.shake : styles.mainSectionText}>{questionString}</p>
          
            <div className={styles.inputButtonContainer}>
              <input
                ref={inputRef}
                placeholder="Answer"
                className={styles.answerInput}
                type={questionType === 1 ? "text" : "number"} 
                inputMode={questionType === 1 ? "text" : "number"}
                pattern="[0-9]*"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
              />
              <a 
                href="#"
                className={submitClass} 
                onClick={(e) => {
                  e.preventDefault(); // Prevents link navigation
                  handleSubmitAnswer();
                }}
              >
                Submit
              </a>
            </div>
        </div>
      </div>
      {/* Affiliate ad iframe */}
      <iframe
        src="https://www.fiverr.com/gig_widgets?id=U2FsdGVkX1+PBFT2MXgrqHNlHx9ePAcjrCeKM30VVSij2+IQ9QlsaZamZ0TvsdKSKBCWwASPBSo0oke+d5hUAkL6OYELetRcYRVdrqjsMdbPZY+c0/bBZre1yCP48Al1X1YWjrX2fvwdM5E3AIFGpMAv7nmpKN5tyg8OCu5UT1Q61NApURYXYst8HEGXPijxCvar1kkZGtF7gfgO5RVas/CX3HqUm45NOFdXei/RstQrJhUR8FFrfP912YJwnUh8Naf0pBHQxZRyahidHqOR12aubY3O6HRo4urwjtRs+UsDGzxADyyeeno1WfAz9Y5qYoA36Dh0SsanBxaWI0qTSTyJTolzbHEq0hZKYm2qkd5ClKdIN8Ba80wvw2XFfuksPJREU5zGb0dBw16zT+BFTuE5ZipdQxbmI1gLBdmtNz8Jz23mFs6aVMf+N3ss8WRTyPy7A5VqR5tP5qhxlpbWeBNehMRvVwjCNdtq2QN0ezHPCj74BnjK2R7cpRUktHXu7Xu23D8WZXJYzvbJSfRWaaD6fTneP+acGlybzD7Mwv0=&affiliate_id=1055777&strip_google_tagmanager=true"
        loading="lazy"
        data-with-title="true"
        className={styles.affiliateAd}
        frameBorder="0"
        height="350"
        width="100%"
        referrerPolicy="no-referrer-when-downgrade"
        data-mode="random_gigs"
        onLoad={() => {
          const frame = document.querySelector(`.${styles.affiliateAd}`);
          const script = document.createElement('script');
          script.addEventListener('load', function () {
            window.FW_SDK.register(frame);
          });
          script.setAttribute('src', 'https://www.fiverr.com/gig_widgets/sdk');
          document.body.appendChild(script);
        }}
      ></iframe>
      {/* Native Ad Section */}
      <footer className={styles.copyright}>
        <p>&copy; 2024 Brain Bucks</p>
      </footer>

      {/* MODALS */}
      {signInModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.modal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>Sign In</p>
          {/* Email */}

          <p className={styles.modalInputText}>Email</p>
          <input 
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}/>
  
          {/* Password */}
          <p className={styles.modalInputText}>Password</p>
          <input
            type={showLoginPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}/>
          <label className={styles.showPasswordLabel}>
            <input
              type="checkbox"
              checked={showLoginPassword}
              onChange={() => setShowLoginPassword(!showLoginPassword)}
            />
              <span className={styles.checkboxText}>Show Password</span>
          </label>

          {/* Sign In */}
          <button 
            className={styles.signInButton}
            onClick={handleLogIn}>
            Sign In
          </button>

          {/* Forgot Password */}
          <button 
            className={styles.forgotPasswordButton}
            onClick={showForgotPasswordModal}>
            Forgot Password
          </button>

          {/* Close Button */}
          <button 
            className={styles.closeButton}
            onClick={() => setSignInModalVisible(false)}>
            Close
          </button>
        </div>
      </div>
      )}

      {registerModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.modal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>Create an Account</p>
          {/* Email */}
          <p className={styles.modalInputText}>Email</p>
          <input 
            type="text"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            className={styles.input}/>
  
          {/* Password */}
          <p className={styles.modalInputText}>Password</p>
          <input
            type={showRegisterPassword ? "text" : "password"}
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            className={styles.input}/>
          <label className={styles.showPasswordLabel}>
            <input
              type="checkbox"
              checked={showRegisterPassword}
              onChange={() => setShowRegisterPassword(!showRegisterPassword)}
            />
              <span className={styles.checkboxText}>Show Password</span>
          </label>

          {/* Confirm Password*/}
          <p className={styles.modalInputText}>Confirm Password</p>
          <input
            type={showRegisterConfirmPassword ? "text" : "password"}
            value={registerConfirmPassword}
            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            className={styles.input}/>
          <label className={styles.showPasswordLabel}>
            <input
              type="checkbox"
              checked={showRegisterConfirmPassword}
              onChange={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
            />
            <span className={styles.checkboxText}>Show Password</span>
          </label>
          <div>
            <ul className={styles.passwordRequirementTitle}>Minimum password requirements:
              <li className={styles.passwordRequirementItem}>Six characters</li>
              <li className={styles.passwordRequirementItem}>One uppercase character</li>
              <li className={styles.passwordRequirementItem}>One lowercase character</li>
              <li className={styles.passwordRequirementItem}>One numeric character</li>
            </ul>
          </div>

          {/* Create Account */}
          <button 
            className={styles.createAccountButton}
            onClick={handleCreateAccount}>
            Create Account
          </button>

          <button className={styles.closeButton}
                  onClick={() => setRegisterModalVisible(false)}>
            Close
          </button>

        </div>
      </div>
      )} 

      {infoModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.infoModal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <button className={styles.xButton} onClick={closeInfoModal}>X</button>
          <p className={styles.modalTitle}>How it works</p>
          <p className={styles.ruleText}>{RULE_TEXT1}</p>
          <br></br>
          <p className={styles.ruleText}>{RULE_TEXT2}</p>
          <br></br>
          <p className={styles.ruleHeader}>Top Left Guide</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Total: </span>The total number of questions answered correctly today.</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Leader: </span>The number of questions today's leader has answered correctly.</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>You: </span>The number of questions you have answered correctly today.</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Balance: </span>Your earnings that are elligible to be transferred to your Paypal account. You must have at least a $20 balance to initiate a transfer.</p>
          <br></br>
          <p className={styles.ruleHeader}>Top Right Guide</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Message Icon: </span>A complete log of your history. This includes a history of your winnings and your payout requests.</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Refresh: </span>Refreshes the total and leader amounts.</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Transfer Balance: </span>Initiate a transfer of your balance directly to your PayPal account.</p>
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Contact: </span>A contact us page.</p>
          <button 
            className={styles.closeButton}
            onClick={closeInfoModal}>
            Close
          </button>

        </div>
      </div>
      )}

      {forgotPasswordModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.modal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>Password Reset</p>
          {/* Email */}

          <p className={styles.modalInputText}>Email</p>
          <input 
            type="text"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            className={styles.input}/>

          {/* Forgot Password */}
          <button 
            className={styles.signInButton}
            onClick={handleForgotPassword}>
            Send Reset Password Link
          </button>

          {/* Close Button */}
          <button 
            className={styles.closeButton}
            onClick={() => setForgotPasswordModalVisible(false)}>
            Close
          </button>

        </div>
      </div>
      )}

      {contactUsModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.modal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>Contact Us</p>

          {/* Subject */}
          <p className={styles.modalInputText}>Subject</p>
          <input 
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={styles.input}/>
  
          {/* Message */}
          <p className={styles.modalInputText}>Message</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className={styles.inputLarge}/>

          {/* Send */}
          <button 
            className={styles.signInButton}
            onClick={handleSendMessage}>
            Send
          </button>


          {/* Close Button */}
          <button 
            className={styles.closeButton}
            onClick={closeContactUsModal}>
            Close
          </button>

        </div>
      </div>
      )}

      {transferBalanceModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.modal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>Transfer Balance</p>

          {/* Balance */}
          <p className={styles.ruleText}>{PAYPAL_TEXT}</p>
          <p className={styles.balanceText}>Balance: ${balance}</p>

          {/* Email */}
          <p className={styles.modalInputText}>Email</p>
          <input 
            type="text"
            value={payPalEmail}
            onChange={(e) => setPayPalEmail(e.target.value)}
            className={styles.input}/>
  
          {/* Confirm Email */}
          <p className={styles.modalInputText}>Confirm Email</p>
          <input
            type="text"
            value={payPalConfirmEmail}
            onChange={(e) => setPayPalConfirmEmail(e.target.value)}
            className={styles.input}/>

          {/* Request Payout */}
          <button 
            className={styles.signInButton}
            onClick={handleRequestPayout}>
            Request Payout
          </button>

          {/* Close Button */}
          <button 
            className={styles.closeButton}
            onClick={closeTransferBalanceModal}>
            Close
          </button>
        </div>
      </div>
      )}

      {messageModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.historyModal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>History</p>

        {/* Conditionally Render Messages or Fallback */}
        <div className={styles.messageContainer}>
          {messageArray.length > 0 ? (
            messageArray.slice().reverse().map((msg, index) => (
              <p key={index} className={styles.messageText}>
                {msg}
              </p>
            ))
          ) : (
            <p className={styles.messageText}>There is no history</p>
          )}
        </div>
          
          {/* Close Button */}
          <button 
            className={styles.closeButton}
            onClick={closeMessageModal}>
            Close
          </button>
        </div>
      </div>
      )}

      {/*{verifyHumanModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.alertModal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>Please answer the following question to prove you are human.</p>
          <p className={styles.alertMessage}>{verifyHumanText}</p>
          <input 
            type="number"
            inputMode="number"
            pattern="[0-9]*"
            value={verifyHumanInput}
            onChange={(e) => setVerifyHumanInput(e.target.value)}
            className={styles.input}/>
          
          <button 
            className={styles.submitButton}
            onClick={verifyHuman}>
            Submit
          </button>
        </div>
      </div>
      )} */}

      {alertModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.alertModal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.alertMessage}>{alertMessage}</p>
          {/* Close Button */}
          <button 
            className={styles.closeButton}
            onClick={closeAlertModalVisible}>
            Close
          </button>
        </div>
      </div>
      )}
    </section>
  )
}