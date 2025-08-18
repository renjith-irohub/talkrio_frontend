import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Cards";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import Navbar from "./Navbar";

const questions = [
  {
    question: "How often do you feel sad or hopeless?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
    category: "Depression",
  },
  {
    question: "Do you frequently feel intense worry or fear about everyday situations?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    category: "Anxiety Disorder",
  },
  {
    question: "Do you struggle to fall asleep or stay asleep at night?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    category: "Sleep Disorder",
  },
  {
    question: "Do you have trouble controlling your use of alcohol or drugs?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    category: "Substance Abuse",
  },
  {
    question: "Do you have an intense fear of gaining weight or unhealthy eating habits?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    category: "Eating Disorder",
  },
  {
    question: "Do you struggle to focus, stay organized, or follow through with tasks?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    category: "ADHD",
  },
  {
    question: "Do you feel the need to repeat certain actions or have intrusive thoughts?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    category: "OCD",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleAnswer = (option) => {
    setResponses({
      ...responses,
      [questions[currentQuestion].category]:
        (responses[questions[currentQuestion].category] || 0) +
        ["Never", "Rarely", "Sometimes", "Often", "Almost always"].indexOf(option),
    });

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const highestCategory = Object.keys(responses).reduce((a, b) =>
      responses[a] > responses[b] ? a : b
    );
    setResult(highestCategory);
  };

  const handleRedirect = () => {
    navigate('/community');
  };

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat pt-20"
        style={{ backgroundImage: "url('/quiz.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <Card className="w-full max-w-2xl bg-white shadow-xl p-8 rounded-3xl">
            <CardContent>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mental Health Self-Assessment</h2>
                <p className="text-gray-600 mt-2">
                  This quiz is designed to help you recognize patterns in your mental health. It is not a diagnosis, but it may help you understand potential concerns.
                </p>
              </div>
              {result ? (
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-blue-700">Possible Condition: {result}</h2>
                  <p className="text-gray-600">
                    This is not a diagnosis. Please consult a professional for proper evaluation.
                  </p>
                  <p className="text-gray-600">
                    Would you like to join our community to discuss your results and connect with others?
                  </p>
                  <div className="space-x-4">
                    <Button
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      onClick={handleRedirect}
                    >
                      Go to Community
                    </Button>
                    <Button
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                      onClick={() => {
                        setCurrentQuestion(0);
                        setResponses({});
                        setResult(null);
                      }}
                    >
                      Restart Quiz
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Progress
                    value={((currentQuestion + 1) / questions.length) * 100}
                    className="h-2 rounded-full bg-gray-300"
                  />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {questions[currentQuestion].question}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}