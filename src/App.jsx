import Header from './components/Header'
import Hero from './components/Hero'
import Vision from './components/Vision'
import About from './components/About'
import Team from './components/Team'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Vision />
        <About />
        <Team />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
