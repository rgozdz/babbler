
import firebase from "../firebase";

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

const isToday = (element) =>{
    let date = new Date();
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
    const today = `${year}-${month}-${day}`;
  
    return element.date === today;
}

const isCompleted = (allCompletedTasks, taskUid, currentUser) =>{
  const completedTask = allCompletedTasks
  .find(element => element.wordUid === taskUid && currentUser.uid === element.userUid);

  return !!completedTask;
}