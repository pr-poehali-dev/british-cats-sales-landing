import { Link } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';

const AdminHome = () => (
  <CabinetShell>
    <p className="cab-eyebrow">// АДМИНИСТРИРОВАНИЕ</p>
    <h1 className="cab-h1">Обзор</h1>
    <p className="cab-sub">
      Управление доступом учеников и аналитика обучения. Сейчас доступен раздел кодов доступа —
      остальные разделы появятся по мере подключения анкет.
    </p>

    <div className="cab-card">
      <h2>Коды доступа</h2>
      <p className="cab-sub" style={{ marginBottom: 20 }}>
        Создание персональных паролей, статус активации и профили учеников.
      </p>
      <Link className="cab-btn cab-inline-btn" to="/cabinet/admin/codes">Открыть раздел</Link>
    </div>

    <div className="cab-card">
      <h2>Что появится дальше</h2>
      <p className="cab-sub" style={{ marginBottom: 0 }}>
        Входная анкета с тестом, промежуточные срезы, итоговая анкета, отчёт «Было → Стало»,
        общая аналитика и выгрузка в CSV.
      </p>
    </div>
  </CabinetShell>
);

export default AdminHome;
