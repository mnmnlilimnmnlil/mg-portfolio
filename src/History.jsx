import './History.scss';

function History() {
    return (
        <div className="history-page">
            <h2>이력</h2>
            <section className="history-section">
                <h3>학력</h3>
                <ul>
                    <li><strong>OO대학교</strong> (2020 - 2026) - XX학과</li>
                    <li><strong>OO고등학교</strong> (2017 - 2020)</li>
                </ul>
            </section>
            <section className="history-section">
                <h3>수상이력</h3>
                <ul>
                    <li><strong>XX 공모전 대상</strong> (2025)</li>
                    <li><strong>OO 해커톤 우수상</strong> (2024)</li>
                </ul>
            </section>
            <section className="history-section">
                <h3>경력</h3>
                <ul>
                    <li><strong>ABC 컴퍼니 인턴</strong> (2025.07 - 2025.08)</li>
                </ul>
            </section>
        </div>
    )
}
export default History;
