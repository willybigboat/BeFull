import pic1 from '../images/pic.png';

const IntroPage = () => {
  return (
    <div className="intro-section">
      <div className="home-image">
        <img src={pic1} alt="Zianba No1" />
      </div>
      <h2>INTRODUCTION</h2>
      <p>米其林指南 - 您的專業餐廳管理系統</p>
    </div>
  );
};

export default IntroPage;