import React, { useState, useEffect, useRef } from "react";

import { getImageUrl } from "../../utils";
import { RULE_TEXT1, RULE_TEXT2, PAYPAL_TEXT } from "../../text/Information";
import db, { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { format, toZonedTime } from 'date-fns-tz';
import { generateMathQuestion, generateWordUnscrambleQuestion, getWordToUnscramble, generateMathSequenceQuestion } from "../../helpers/QuestionHelper";
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

  //Log in Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterComfirmPassword] = useState('');
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

  //Game Data
  const [total, setTotal] = useState(0);
  const [leaderTotal, setLeaderTotal] = useState(0);
  const [userTotal, setUserTotal] = useState(() => {
    const savedScore = localStorage.getItem("userTotal");
    return savedScore ? JSON.parse(savedScore) : 0;
  })
  const [userTotalSinceLastRefresh, setUserTotalSinceLastRefresh] = useState(() => {
    const savedScore = localStorage.getItem("userTotalSinceLastRefresh");
    return savedScore ? JSON.parse(savedScore) : 0;
  })
  const [balance, setBalance] = useState(0);
  const [todayString, setTodayString] = useState(0);
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
  useEffect(() => {
    localStorage.setItem("messageArray", JSON.stringify(messageArray));
  }, [messageArray]);

  useEffect(() => {
    localStorage.setItem("userTotal", JSON.stringify(userTotal));
  }, [userTotal]);

  useEffect(() => {
    localStorage.setItem("userTotalSinceLastRefresh", JSON.stringify(userTotalSinceLastRefresh));
  }, [userTotalSinceLastRefresh]);

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

  useEffect(() => {
    //Get today's date, in central time
    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');
    setTodayString(formattedDate);

    //Load question
    if (!question) {
      setQuestion(generateQuestion());
    }

    //Load Payout, Leader total, and overall total
    getGameStats(formattedDate);

    //Load user if signed in
    const storedUser = localStorage.getItem("currentUser");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.loggedIn) {
        setSignedIn(true);
        setUserId(parsedUser.username);
        // If the user total isn't saved to local storage, get it from the database
        if (!userTotal) {
          var userDocRef = doc(db, 'dates/' + formattedDate + '/users', parsedUser.username);
          getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
              var data = docSnap.data();
              setUserTotal(data.userTotal);
            }
            else {
              setUserTotal(0);
            }
          })
        }
        // If the messageArray isn't saved to local storage, get it from the database
        if (messageArray.length == 0) {
          var messageArrayLocal = [];
          const messagesRef = collection(db, 'users/' + parsedUser.username + '/messages');
          getDocs(messagesRef).then(dateSnapshots => {
            for (const dateDoc of dateSnapshots.docs) {
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
            }
            setMessageArray(messageArrayLocal);
          })
        }

        // User Balance
        var balanceDocRef = doc(db, 'users', parsedUser.username);
        getDoc(balanceDocRef).then(docSnap => {
          var data = docSnap.data();
          setBalance(data.highScoreBalance + data.lotteryBalance);
        })
      }
    }
  }, [])

  
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

  //Transfer Balance
  const handleClickTransferBalance = () => {
    if (!signedIn) {
      setAlertMessage("Please sign in to transfer an existing balance");
      setAlertModalVisible(true);
      return;
    }
    setTransferBalanceModalVisible(true);
  }

  const handleRequestPayout = () => {
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

    addDoc(collection(db, 'requests/' + todayString + '/' + userId),  {
      paypalEmail: payPalEmail,
      email: email,
      balance: balance,
    })
    

    var userDocRef = doc(db, 'users', userId);
    setDoc(userDocRef, {
      highScoreBalance: 0,
      lotteryBalance: 0
    }, {merge: true});

    //Add message
    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'MMM dd yyyy');
    const formattedDate2 = format(centralTime, 'yyyy MM dd');

    var transferBalanceMessage = formattedDate + ": You requested a payout of $" + balance + "."
    var tempMessageArray = messageArray;
    tempMessageArray.push(transferBalanceMessage);
    setMessageArray(tempMessageArray);
    setBalance(0);

    var docRef = doc(db, 'users/' + userId + "/messages/" + formattedDate2);
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

  const handleSendMessage = () => {
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

    addDoc(collection(db, 'feedback/' + todayString + '/' + userId), {
      subject: subject,
      message: message,
      userId: userId,
      email: email
    })

    setAlertMessage("Thanks for your message!");
    setAlertModalVisible(true);
    setContactUsModalVisible(false);
  }


  //Refresh
  const handleRefresh = () => {
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Please check your connection");
      setAlertModalVisible(true);
      return;
    }

    // If new day, let's handle cutover
    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');
    if (todayString != formattedDate) {
      handleCutover();
      inputRef.current.focus();
      return;
    }
    

    var userDocRef = doc(db, 'dates/' + todayString + '/users', userId);
    setDoc(userDocRef, {
      userTotal: userTotal
    }, {merge: true});

    var datesDocRef = doc(db, 'dates', todayString);
    getDoc(datesDocRef).then(docSnap => {
      if (docSnap.exists()) {
        var data = docSnap.data();
        var currentHighScore = data.highScore;
        if (userTotal >= currentHighScore) {
          setDoc(datesDocRef, {
            highScore: userTotal,
            user: userId
          }, {merge: true});
          setLeaderTotal(userTotal);
        }
        else {
          setLeaderTotal(currentHighScore);
        }
        var currentTotal = data.total;
        setDoc(datesDocRef, {
          total: currentTotal + userTotalSinceLastRefresh
        }, {merge: true});
        setTotal(currentTotal + userTotalSinceLastRefresh);
        setUserTotalSinceLastRefresh(0);
      }
    })

    inputRef.current.focus();
  }

  //Math Functions
  function generateQuestion() {
    var retVal = ''; 
    var questionTypeLocal = getRandomInt(3);
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
  const handleSubmitAnswer = () => {
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

    const timeZone = 'America/Chicago';
    const now = new Date();
    const centralTime = toZonedTime(now, timeZone);
    const formattedDate = format(centralTime, 'yyyy MM dd');

    if (todayString != formattedDate) {
      handleCutover(formattedDate);
    }

    //Math Question
    if (questionType == 0) {
      var result = evaluate(question);
      if (inputAnswer == result) {
        //Correct
        handleCorrect();
      }
      else {
        //Incorrect
        handleIncorrect();
      }
    }
    
    //Word Unscramble Question
    if (questionType == 1) {
      if (inputAnswer.toLowerCase == wordToUnscramble.toLowerCase) {
        handleCorrect();
      }
      else {
        handleIncorrect();
      }
    }

    //Word Unscramble Question
    if (questionType == 2) {
      if (inputAnswer == sequenceAnswer) {
        handleCorrect();
      }
      else {
        handleIncorrect();
      }
    }

    //Auto-focus on input field
    inputRef.current.focus();
  }

  const handleCutover = (dateString) => {
    setAlertMessage("A new day has started");
    setAlertModalVisible(true);
    setUserTotal(0);
    setUserTotalSinceLastRefresh(0);

    var datesDocRef = doc(db, 'dates', dateString);
    getDoc(datesDocRef).then(docSnap => {
      if (docSnap.exists()) {
        var data = docSnap.data();
        setLeaderTotal(data.highScore);
        setTotal(data.total);
        setTodayString(dateString);
      }
      else {
        setAlertMessage("Cutover to new day has not completed. Please wait a few moments and try again.");
        setAlertModalVisible(true);
      }
    })

    var balanceDocRef = doc(db, 'users', userId);
    getDoc(balanceDocRef).then(docSnap => {
      var data = docSnap.data();
      setBalance(data.highScoreBalance + data.lotteryBalance);
    });
  }

  const handleCorrect = () => {
    setCorrectAnimation(true);
    setTimeout(() => {
      setCorrectAnimation(false);
      setUserTotalSinceLastRefresh((prev) => prev + 1);

      setTimeout(() => {
        setUserTotal((prevTotal) => prevTotal + 1);
        setQuestion(generateQuestion);
        setInputAnswer('');
      }, 200);
    }, 800);
  }

  const handleIncorrect = () => {
    setIncorrectAnimation(true);
    setTimeout(() => setIncorrectAnimation(false), 600);
  }


  //Firebase Functions
  const getGameStats = (dateString) => {

    dateString = dateString ? dateString : todayString;
    var datesDocRef = doc(db, 'dates', dateString);
    getDoc(datesDocRef).then(docSnap => {
      if (docSnap.exists()) {
        var data = docSnap.data();
        //Payout
        setPayout(data.payout);

        //Overall Total
        setTotal(data.total);

        //Leader Total
        setLeaderTotal(data.highScore);
      }
    }) 
  }

  //Authentication Functions
  const handleLogIn = () => {
    if (!navigator.onLine) {
      setAlertMessage("You are offline. Please check your connection")
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
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Signed in
        const user = userCredential.user;
        setUserId(user.uid);
        setSignInModalVisible(false);

        const jsonUser = { username: user.uid, loggedIn: true};
        localStorage.setItem("currentUser", JSON.stringify(jsonUser));
        localStorage.setItem("email", email);
        setSignedIn(true);
        setPassword('');

        //Refresh game stats
        //Get today's date, in central time
        const timeZone = 'America/Chicago';
        const now = new Date();
        const centralTime = toZonedTime(now, timeZone);
        const formattedDate = format(centralTime, 'yyyy MM dd');

        getGameStats(formattedDate);
        // User Score
        var userDocRef = doc(db, 'dates/' + formattedDate + '/users', user.uid);
        getDoc(userDocRef).then(docSnap => {
          if (docSnap.exists()) {
            var data = docSnap.data();
            setUserTotal(data.userTotal);
          }
          else {
            setUserTotal(0);
          }
        })
        // User Balance
        var balanceDocRef = doc(db, 'users', user.uid);
        getDoc(balanceDocRef).then(docSnap => {
          var data = docSnap.data();
          setBalance(data.highScoreBalance + data.lotteryBalance);
        })

        // Message
        var messageArrayLocal = [];
        const messagesRef = collection(db, 'users/' + user.uid + '/messages');
        getDocs(messagesRef).then(dateSnapshots => {
          for (const dateDoc of dateSnapshots.docs) {
            const messageData = dateDoc.data();
            if (messageData.accountCreationMessage) {
              messageArrayLocal.push(messageData.accountCreationMessage);
            }
            if (messageData.lotteryMessage) {
              messageArrayLocal.push(messageData.lotteryMessage);
            }
            if (messageData.highScoreMessage) {
              messageArrayLocal.push(messageData.highScoreMessage);
            }
            if (messageData.transferBalanceMessage) {
              messageArrayLocal.push(messageData.transferBalanceMessage);
            }
          }
          setMessageArray(messageArrayLocal);
        })
      })
      .catch(error => {
        var errorMessage = error.message;
        if (errorMessage.includes("invalid-email")) {
          errorMessage = "The email entered is not valid";
        }
        else if (errorMessage.includes("user-not-found")) {
          errorMessage = "The email does not have a registered account"
        }
        else if (errorMessage.includes("wrong-password")) {
          errorMessage = "Invalid credentials"
        }
        setAlertMessage(errorMessage);
        setAlertModalVisible(true);
      });
  }

  const handleCreateAccount = () => {
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
    if (registerPassword != registerConfirmPassword) {
      setAlertMessage("The passwords do not match");
      setAlertModalVisible(true);
      return;
    }
    setEmail(registerEmail);
    //Register the account with Firebase
    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
    .then((userCredentials) => {
      //User Created
      const user = userCredentials.user;
      var docRef = doc(db, 'users', user.uid);
      setDoc(docRef, {
        id: user.uid,
        email: registerEmail,
        highScoreBalance: 0,
        lotteryBalance: 0
      });
      setUserId(user.uid);
      setRegisterModalVisible(false);
      localStorage.setItem("email", registerEmail);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterComfirmPassword('');

      //Add "account created" message
      const timeZone = 'America/Chicago';
      const now = new Date();
      const centralTime = toZonedTime(now, timeZone);
      const formattedDate2 = format(centralTime, 'MMM dd yyyy');
      const formattedDate = format(centralTime, 'yyyy MM dd');

      var accountCreationMessage = formattedDate2 + ": Account created."
      var tempMessageArray = messageArray;
      tempMessageArray.push(accountCreationMessage);
      setMessageArray(tempMessageArray);
      setBalance(0);

      var docRef = doc(db, 'users/' + userId + "/messages/" + formattedDate);
      setDoc(docRef, {
        accountCreationMessage: accountCreationMessage
      }, {merge: true});

      //Auto sign in the user
      signInWithEmailAndPassword(auth, registerEmail, registerPassword)
        .then((userCredential) => {
          //Signed in
          const jsonUser = { username: user.uid, loggedIn: true};
          localStorage.setItem("currentUser", JSON.stringify(jsonUser));
          setSignedIn(true);
  
          //Refresh game stats
          getGameStats(formattedDate);
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
    })
    .catch(error => {
      var errorMessage = error.message;
      if (errorMessage.includes("email-already-in-use")) {
        errorMessage = "This email is already associated with an account"
      }
      setAlertMessage(errorMessage);
      setAlertModalVisible(true);
    })
  }

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

  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      localStorage.removeItem("currentUser");
      setSignedIn(false);
      setUserTotal(0);
      setBalance(0);
      setEmail(localStorage.getItem("email"));
    })
    .catch(error => { 
      setAlertMessage(error.message);
      setAlertModalVisible(true);
    });
  }
  
  return (
    <section className={styles.container}>
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
                onClick={() => setMessageModalVisible(true)}/>
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
            <button 
              className={styles.topSectionRightButton}
              onClick={handleRefresh}>
                Refresh
            </button>
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
          <p className={styles.mainSectionText}>Prize Pool: ${payout}</p>
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
                  handleSubmitAnswer();
                }
              }}
              />
            <button 
              className={styles.submitButton}
              onClick={handleSubmitAnswer}>Submit</button>
          </div>
        </div>
      </div>

      <footer className={styles.copyright}>
        <p>Brain Bucks &copy; 2024</p>
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
            onChange={(e) => setRegisterComfirmPassword(e.target.value)}
            className={styles.input}/>
          <label className={styles.showPasswordLabel}>
            <input
              type="checkbox"
              checked={showRegisterConfirmPassword}
              onChange={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
            />
            <span className={styles.checkboxText}>Show Password</span>
          </label>

          {/* Create Account */}
          <button 
            className={styles.signInButton}
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
          <p className={styles.ruleText}><span style={{fontWeight: "bold"}}>Refresh: </span>Refreshes the total and leader amounts, and updates your total in our database.</p>
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

      {alertModalVisible && (
      <div className={styles.modalBackdrop}>
        <div 
          className={styles.alertModal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalTitle}>Alert</p>
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