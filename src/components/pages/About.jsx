import Header from '../Header';

const About = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Header />
      <h1 style={{ fontWeight: '900', borderLeft: '6px solid black', paddingLeft: '12px' }}>ABOUT PAGE</h1>
      <p>Ini halaman About.jsx</p>
    </div>
  );
}
export default About;