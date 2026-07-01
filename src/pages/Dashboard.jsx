import { useEffect, useState } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { getStats, getBotStatus } from '../api'
import PageHeader from '../components/PageHeader'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend
)

const chartOpts = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false } },
}

function Dashboard() {
  const [activite, setActivite] = useState(null)
  const [presences, setPresences] = useState(null)
  const [notes, setNotes] = useState(null)
  const [botEnLigne, setBotEnLigne] = useState(null)

  useEffect(() => {
    getStats('activite').then(setActivite).catch(() => {})
    getStats('presences').then(setPresences).catch(() => {})
    getStats('notes').then(setNotes).catch(() => {})
    getBotStatus()
      .then(s => setBotEnLigne(s?.botHttp?.connected === true))
      .catch(() => setBotEnLigne(false))
  }, [])

  const kpis = [
    { label: 'Tickets en attente', value: activite?.tickets_en_attente ?? '...', color: '#dc3545', icon: '🎫' },
    { label: 'Absences enregistrées', value: activite?.total_absences_enregistrees ?? '...', color: '#fd7e14', icon: '🚨' },
    { label: 'Notes enregistrées', value: activite?.total_notes_enregistrees ?? '...', color: '#198754', icon: '🎓' },
    { label: 'Moyenne globale', value: notes?.moyenne_globale ? `${notes.moyenne_globale}/20` : '...', color: '#5865f2', icon: '📊' },
  ]

  const presencesLabels = presences ? Object.keys(presences.par_promotion) : []
  const presencesValues = presences ? Object.values(presences.par_promotion).map(v => parseInt(v)) : []
  const notesLabels = notes ? Object.keys(notes.par_promotion) : []
  const notesValues = notes ? Object.values(notes.par_promotion).map(v => parseFloat(v)) : []

  return (
    <div className="page">
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité Ingetis">
        {botEnLigne !== null && (
          <span className={`status-pill ${botEnLigne ? 'status-pill--online' : 'status-pill--offline'}`}>
            <span className="status-dot" />
            Bot {botEnLigne ? 'en ligne' : 'hors ligne'}
          </span>
        )}
      </PageHeader>

      <Row className="kpi-grid g-3">
        {kpis.map(kpi => (
          <Col key={kpi.label} xs={12} sm={6} xl={3}>
            <Card className="kpi-card">
              <Card.Body>
                <div className="kpi-icon" style={{ backgroundColor: kpi.color + '18' }}>
                  {kpi.icon}
                </div>
                <div>
                  <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                  <div className="kpi-label">{kpi.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={8}>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Moyenne par promotion</Card.Title>
              <div className="chart-container">
                {notesLabels.length > 0 ? (
                  <Line
                    data={{
                      labels: notesLabels,
                      datasets: [{
                        label: 'Moyenne',
                        data: notesValues,
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25, 135, 84, 0.1)',
                        fill: true,
                        tension: 0.4,
                      }],
                    }}
                    options={{ ...chartOpts, scales: { y: { min: 0, max: 20 } } }}
                  />
                ) : (
                  <div className="empty-state">Aucune donnée disponible</div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Présences par promotion</Card.Title>
              <div className="chart-container">
                {presencesLabels.length > 0 ? (
                  <Doughnut
                    data={{
                      labels: presencesLabels,
                      datasets: [{
                        data: presencesValues,
                        backgroundColor: ['#5865f2', '#198754', '#fd7e14', '#dc3545', '#6f42c1', '#20c997'],
                      }],
                    }}
                    options={chartOpts}
                  />
                ) : (
                  <div className="empty-state">Aucune donnée disponible</div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title>Taux de présence par promotion</Card.Title>
              <div className="chart-container">
                {presencesLabels.length > 0 ? (
                  <Bar
                    data={{
                      labels: presencesLabels,
                      datasets: [{
                        label: 'Taux (%)',
                        data: presencesValues,
                        backgroundColor: '#5865f2',
                        borderRadius: 6,
                      }],
                    }}
                    options={{ ...chartOpts, scales: { y: { max: 100 } } }}
                  />
                ) : (
                  <div className="empty-state">Aucune donnée disponible</div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
