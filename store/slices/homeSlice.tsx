import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "../../config/firebase";
import { produce } from "immer";

interface Answer {
  id: string;
  text: string;
  author: string; // Assuming author is the user ID
  // Add more properties as needed
}

interface GetAnswerArgs {
  docId: string;
}

export const getQuestions = createAsyncThunk(
  "home/getQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await firebase.firestore().collection("questions").get();

      const questions: Promise<any>[] = snapshot.docs.map(async (doc) => {
        console.log(doc.data(), "docdocdocdocdocahsan");
        const questionData: any = {
          id: doc.id,
          ...doc.data(),
        };

        if (questionData.author) {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(questionData.author)
            .get();
          if (userDoc.exists) {
            questionData.author = userDoc.data();
          } else {
            questionData.author = null;
          }
        } else {
          questionData.author = null;
        }

        return questionData;
      });

      // Resolve all promises in parallel
      const resolvedQuestions = await Promise.all(questions);

      return resolvedQuestions;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// export const getSingleQuestion = createAsyncThunk(
//   "home/getSingleQuestion",
//   async ({ docId, userId }: any, { rejectWithValue }) => {
//     try {
//       const docSnapshot = await firebase
//         .firestore()
//         .collection("questions")
//         .doc(docId)
//         .get();

//       if (docSnapshot.exists) {
//         const questionData: any = {
//           id: docSnapshot.id,
//           ...docSnapshot.data(),
//         };

//         // Fetch author data from users collection based on authorId
//         if (questionData?.author) {
//           const userDoc = await firebase
//             .firestore()
//             .collection("users")
//             .doc(questionData?.author)
//             .get();
//           if (userDoc.exists) {
//             questionData.author = userDoc.data();
//           } else {
//             questionData.author = null; // Handle case where author is not found
//           }
//         } else {
//           questionData.author = null; // Handle case where authorId is missing
//         }

//         return questionData;
//       } else {
//         return null; // Handle case where the document does not exist
//       }
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const getSingleQuestion = createAsyncThunk(
  "home/getSingleQuestion",
  async ({ docId, userId }: any, { rejectWithValue }) => {
    try {
      // Fetch question data from 'questions' collection
      const questionDoc = await firebase
        .firestore()
        .collection("questions")
        .doc(docId)
        .get();

      if (questionDoc.exists) {
        let questionData: any = {
          id: questionDoc.id,
          ...questionDoc.data(),
        };

        if (questionData?.author) {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(questionData?.author)
            .get();
          questionData.author = userDoc.exists ? userDoc.data() : null;
        } else {
          questionData.author = null;
        }

        const votesQuerySnapshot = await firebase
          .firestore()
          .collection("votes")
          .where("docId", "==", docId)
          .where("userId", "==", userId)
          .get();

        if (!votesQuerySnapshot.empty) {
          const votesData = votesQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          questionData.stats = votesData;
        } else {
          questionData.stats = null;
        }

        return questionData;
      } else {
        return null;
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const handleVotes = createAsyncThunk(
  "home/handleVotes",
  async ({ payload, onSuccess }: any, { rejectWithValue }) => {
    console.log(payload, "payload");
    try {
      const votesQuerySnapshot = await firebase
        .firestore()
        .collection("votes")
        .where("docId", "==", payload?.docId)
        .where("userId", "==", payload?.userId)
        .get();

      let addVotes: any;
      console.log(addVotes, "addVotesaddVotes");

      if (votesQuerySnapshot.empty) {
        await firebase
          .firestore()
          .collection("votes")
          .add(payload)
          .then((docRef) => {
            console.log(docRef?.id, "Document written with ID: ", docRef?.id);
            addVotes = docRef?.id;
            if (payload?.type == "upvote") {
              firebase
                .firestore()
                .collection("questions")
                .doc(payload?.docId)
                .update({
                  upvotes: firebase.firestore.FieldValue.increment(1),
                });
            } else {
              firebase
                .firestore()
                .collection("questions")
                .doc(payload?.docId)
                .update({
                  downvotes: firebase.firestore.FieldValue.increment(1),
                });
            }
          });
      } else {
        await firebase
          .firestore()
          .collection("votes")
          .doc(payload?.udpateId)
          .update(payload);
      }
      const docId = addVotes || payload?.udpateId;

      console.log(docId, "docIddocIddocId");
      onSuccess(docId);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUpdatedStats = createAsyncThunk(
  "home/getUpdatedStats",
  async ({ docId }: any, { rejectWithValue }) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("votes")
        .doc(docId)
        .get();
      const paylaod = {
        ...snapshot.data(),
        id: snapshot.id,
      };
      return paylaod;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUpdatedQuestion = createAsyncThunk(
  "home/getUpdatedQuestion",
  async ({ questionId }: any, { rejectWithValue }) => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("questions")
        .doc(questionId)
        .get();
      const paylaod: any = {
        ...snapshot.data(),
        id: snapshot.id,
      };
      console.log(paylaod, "paylaodudpatedbyahsan");
      return paylaod;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addAnswers = createAsyncThunk(
  "home/addAnswers",
  async ({ payload, onSuccess }: any, { rejectWithValue }) => {
    try {
      const createdAt = firebase.firestore.FieldValue.serverTimestamp();
      payload.createdAt = createdAt;
      await firebase
        .firestore()
        .collection("questions")
        .doc(payload?.question)
        .collection("answers")
        .add(payload);

      onSuccess("Answer Submit Successfully");
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getAnswer = createAsyncThunk<Answer[], GetAnswerArgs>(
  "home/getAnswer",
  async ({ docId }, { rejectWithValue }) => {
    try {
      const answers: Answer[] = [];

      const initialSnapshot = await firebase
        .firestore()
        .collection("questions")
        .doc(docId)
        .collection("answers")
        .get();

      initialSnapshot.forEach((doc: any) => {
        const answerData = doc.data() as any;
        answers.push({
          id: doc.id,
          ...answerData,
        });
      });

      if (answers.length === 0) {
        return [];
      }

      const authorIds = answers.map((answer) => answer.author);

      const usersSnapshot = await firebase
        .firestore()
        .collection("users")
        .where(firebase.firestore.FieldPath.documentId(), "in", authorIds)
        .get();

      const usersMap: Record<string, any> = {};
      usersSnapshot.forEach((userDoc) => {
        usersMap[userDoc.id] = userDoc.data();
      });

      answers.forEach((answer: any) => {
        answer.author = usersMap[answer.author];
      });

      if (answers.length > 0) {
        return answers;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error("Error in getAnswer thunk:", error);
      return rejectWithValue(error.message);
    }
  }
);

interface AuthState {
  allQuestions: any;
  answers: any;
  sinleQuestion: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  allQuestions: [],
  answers: [],
  sinleQuestion: null,
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnswer.pending, (state) => {
        console.log("Running");
        // state.loading = true;
        state.error = null;
      })
      .addCase(getAnswer.fulfilled, (state, action) => {
        // state.loading = false;
        state.answers = action.payload;
      })
      .addCase(getAnswer.rejected, (state, action) => {
        console.log("Error");
        // state.loading = false;
        state.error = action.error;
      })
      .addCase(getQuestions.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.allQuestions = action.payload;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(addAnswers.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(addAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.allQuestions = action.payload;
      })
      .addCase(addAnswers.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(handleVotes.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(handleVotes.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(handleVotes.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getSingleQuestion.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleQuestion.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "Updated question data:");
        state.sinleQuestion = action.payload;
      })
      .addCase(getSingleQuestion.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getUpdatedStats.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpdatedStats.fulfilled, (state, action) => {
        console.log(state.sinleQuestion, "state.sinleQuestion");
        state.loading = false;
        console.log(action.payload, "Updated question data by ahsan iqbal:");
        if (state.sinleQuestion && state.sinleQuestion.stats) {
          state.sinleQuestion.stats[0] = action.payload;
        } else {
          state.sinleQuestion.stats = [action.payload];
          console.log("sinleQuestion or its stats array is null or undefined.");
        }
      })
      .addCase(getUpdatedStats.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getUpdatedQuestion.pending, (state) => {
        console.log("Running");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpdatedQuestion.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, "Updated question data:");

        if (state.sinleQuestion) {
          state.sinleQuestion = produce(state.sinleQuestion, (draft: any) => {
            draft.upvotes = action.payload?.upvotes;
            draft.downvotes = action.payload?.downvotes;
          });
        } else {
          console.log("state.singleQuestion is null or undefined.");
        }
      })
      .addCase(getUpdatedQuestion.rejected, (state, action) => {
        console.log("Error");
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default homeSlice.reducer;
