import pic1 from '../images/pic.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={pic1} alt="Zianba No1" />
        <h1>餐廳管理系統</h1>
      </div>
    </header>
  );
};

export default Header;