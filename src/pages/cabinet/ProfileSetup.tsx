import { Link } from 'react-router-dom';

const ProfileSetup = () => (
  <div className="cab cab-login">
    <div className="spot l" />
    <div className="grid-bg" />
    <div className="cab-login-card">
      <img className="cab-login-logo" src="/site/logo.jpg" alt="Хакни Нейросети" />
      <h1>Добро пожаловать!</h1>
      <p>
        Перед началом нужно заполнить короткий профиль — это займёт около двух минут.
        Форма создания профиля подключается на следующем этапе.
      </p>
      <div className="cab-hint" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
        <Link to="/cabinet/login">← К входу</Link>
      </div>
    </div>
  </div>
);

export default ProfileSetup;
