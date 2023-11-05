import axios from 'axios'
const endpoint = "https://eighty-lions-rhyme.loca.lt";

async function sendSMS(message, to) {
  try {
    const response = await axios.post(
      "https://edu-hub-sms-service-1.vercel.app/send",
      {
        recepients: to,
        message,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Login user endpoint
export const subscribeToService = async (question, numbers) => {
  let data = JSON.stringify({
    question: question,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${endpoint}/api/questions`,
    headers: {
      "Content-Type": "application/json",
      "Bypass-Tunnel-Reminder": "your-header-value-here",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));

      sendSMS(
        "Question: " +
          question +
          "? :\n\n" +
          "Response :\n" +
          response.data.answer,
        numbers
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

// Get service details from the user
const fetchServiceDetails = async (coll_id) => {
  try {
    const data = JSON.stringify({
      coll_id: coll_id,
    });

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${endpoint}/api/v1/services/nl`,
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "your-header-value-here",
      },
      data: data,
    };

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
