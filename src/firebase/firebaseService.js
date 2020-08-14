
import firebase from "../firebase";

export const getUserByName = (username) => {

  let allWordsPromise = new Promise((resolve, reject) => {
      firebase
      .database()
      .ref("/users/")
      .once("value")
      .then((snapshot) => {

        const users = snapshot.val();
        if (users) {
          const userList = Object.keys(users).map((key) => ({
            ...users[key],
            uid: key
          }));

          const user = userList.find(x => x.username === username);
          resolve(user);
        }
        
        resolve(null);
      })
  })
  
  return allWordsPromise;
}

export const getAllWords = () => {

    let allWordsPromise = new Promise((resolve, reject) => {
        firebase
        .database()
        .ref("/words/")
        .once("value")
        .then((snapshot) => {
  
          const words = snapshot.val();
          if (words) {
            const wordList = Object.keys(words).map((key) => ({
              ...words[key],
              uid: key
            }));
            resolve(wordList);
          }
          
          resolve([]);
        })
    })
    
    return allWordsPromise;
}

export const getWordByName = (name) => {
  const word = getAllWords()
      .then((allWords) => {
        const foundWord = allWords
          .find(word => word.name === name);

        return foundWord;
    })
    return word;
}

export const getFirstFreeDate = () => {
  const word = new Promise((resolve) => {
    getAllWords()
    .then((allWords) => {
      
      const wordsInFuture = allWords.filter(word => new Date(word.date).getTime() > Date.now());
      let nextDay = new Date();
      let foundWord = null;
      
      do {

        nextDay.setDate(nextDay.getDate() + 1);
        let formattedDate = formatDate(nextDay);
        foundWord = wordsInFuture.find(word => word.date === formattedDate);
 
      } while(!!foundWord);

      resolve(formatDate(nextDay));

    });
  });

  return word;
}

export const isDateAlreadyUsed = (date) => {
  const word = new Promise((resolve) => {
    getAllWords()
    .then((allWords) => {
      
      const wordsInFuture = allWords.filter(word => new Date(word.date).getTime() > Date.now());
      const foundWord = wordsInFuture.find(word => word.date === date);
      resolve(!foundWord);
    });
  });

  return word;
}

export const isNameAlreadyUsed = (name) => {
  const word = new Promise((resolve) => {
    getAllWords()
    .then((allWords) => {
      const foundWord = allWords.find(word => word.name === name);
      resolve(!foundWord);
    });
  });

  return word;
}

export const deleteWord = (uid) => {

  let deletedWordPromise = new Promise((resolve) => {
    firebase
    .database()
    .ref(`/words/${uid}`)
    .remove()
    .then(() => resolve("word deleted"))
})

  return deletedWordPromise;
}

export const getDailyWord = (currentUser) => {

    let dailyWordPromise = new Promise((resolve) => {
        getAllWords()
        .then((allWords) => {
  
            const dailyWord = allWords.find(isToday);
            
            return dailyWord;
        })
        .then((todayWord) => {
            if (todayWord) {
              firebase
                .database()
                .ref("/completedTasks/")
                .once("value")
                .then((snapshot) => {
                  const completedTaskList = snapshot.val();
                  if (completedTaskList) {
                    const completedTasks = Object.keys(completedTaskList).map(
                      (key) => ({
                        ...completedTaskList[key],
                        uid: key,
                      })
                    );
    
                    const completedTask = completedTasks.find(
                      (task) =>
                        task.userUid === currentUser.uid &&
                        task.wordUid === todayWord.uid
                    );
    
                    if (!completedTask) {
                      resolve(todayWord);
                    } else {
                      resolve(null);
                    }
                    
                  } else {
                    resolve(todayWord);
                  }
                })
            } else {
              resolve(null);
            }

        })
    })

    return dailyWordPromise;
}

export const getUserTasksHistory = (currentUser) => {

  let dailyWordPromise = new Promise((resolve) => {
    getAllWords()
    .then((wordList) => {
      if (wordList) {
        firebase
          .database()
          .ref("/completedTasks/")
          .once("value")
          .then((snapshot) => {
            const completedTaskList = snapshot.val();
            if (completedTaskList) {
              const allCompletedTasks = Object.keys(completedTaskList).map(
                (key) => ({
                  ...completedTaskList[key],
                  uid: key,
                })
              );

              const completedTasks = wordList.filter(
                (task) =>
                  isCompleted(allCompletedTasks, task.uid, currentUser)
              );

              resolve(completedTasks);
          }
          resolve(null);
        })
        }})
  })

  return dailyWordPromise;
}

const formatDate = (date) => {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
  ] = dateTimeFormat.formatToParts(date);
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const isToday = (element) =>{
    let date = new Date();
    const today = formatDate(date);
  
    return element.date === today;
}

const isCompleted = (allCompletedTasks, taskUid, currentUser) =>{
  const completedTask = allCompletedTasks
  .find(element => element.wordUid === taskUid && currentUser.uid === element.userUid);

  return !!completedTask;
}