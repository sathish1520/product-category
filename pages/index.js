import Layout from "../components/Layout";
import LoginPage from "./Login";
import RegisterPage from "./Register";
// import '../pages/assets/scss/main.scss'
export const ElearningAxios = 'http://localhost:5001'

export default function Home() {
  return <>
    <RegisterPage/>
    </>
}