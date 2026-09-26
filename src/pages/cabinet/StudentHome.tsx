import CabinetShell from '@/components/cabinet/CabinetShell';
import { useCabinet } from '@/contexts/CabinetAuth';

const StudentHome = () => {
  const { me } = useCabinet();
  const name = me?.profile?.first_name || 'ученик';

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// ЛИЧНЫЙ КАБИНЕТ</p>
      <h1 className="cab-h1">Здравствуйте, {name}!</h1>
      <p className="cab-sub">
        {me?.group_name ? `Группа: ${me.group_name}. ` : ''}
        Здесь появятся ваши анкеты и личная динамика обучения.
      </p>

      <div className="cab-card">
        <h2>Входная анкета</h2>
        <p className="cab-sub" style={{ marginBottom: 0 }}>
          <span className="cab-badge gray">СКОРО</span>
          <br />
          <br />
          Анкета зафиксирует ваш стартовый уровень, цель обучения и задачу, которую хотите решить с помощью ИИ.
        </p>
      </div>

      <div className="cab-card">
        <h2>Промежуточная анкета</h2>
        <p className="cab-sub" style={{ marginBottom: 0 }}>
          <span className="cab-badge gray">ПОКА НЕДОСТУПНА</span>
        </p>
      </div>

      <div className="cab-card">
        <h2>Итоговая анкета</h2>
        <p className="cab-sub" style={{ marginBottom: 0 }}>
          <span className="cab-badge gray">ПОКА НЕДОСТУПНА</span>
        </p>
      </div>
    </CabinetShell>
  );
};

export default StudentHome;
