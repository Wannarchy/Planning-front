import { useEffect, useState } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { getStats } from '../api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend
)

function Dashboard() {
  const [activite, setActivite] = useState(null)
  const [presences, setPresences] = useState(null)
  const [notes, setNotes] = useState(null)

  useEffect(() => {
    getStats('activite').then(setActivite).catch(() => {})
    getStats('presences').then(setPresences).catch(() => {})
    getStats('notes').then(setNotes).catch(() => {})
  }, [])

  const kpis = [
    { label: 'Tickets en attente', value: activite?.tickets_en_attente ?? '...', color: '#dc3545', icon: '🎫' },
    { label: 'Absences enregistrées', value: activite?.total_absences_enregistrees ?? '...', color: '#fd7e14', icon: '🚨' },
    { label: 'Notes enregistrées', value: activite?.total_notes_enregistrees ?? '...', color: '#198754', icon: '🎓' },
    { label: 'Moyenne globale', value: notes?.moyenne_globale ? `${notes.moyenne_globale}/20` : '...', color: '#0d6efd', icon: '📊' },
  ]

  // Graphique présences par promotion
  const presencesLabels = presences ? Object.keys(presences.par_promotion) : []
  const presencesValues = presences ? Object.values(presences.par_promotion).map(v => parseInt(v)) : []

  const barData = {
    labels: presencesLabels,
    datasets: [{
      label: 'Taux de présence (%)',
      data: presencesValues,
      backgroundColor: '#0d6efd',
      borderRadius: 6,
    }]
  }

  // Graphique notes par promotion
  const notesLabels = notes ? Object.keys(notes.par_promotion) : []
  const notesValues = notes ? Object.values(notes.par_promotion).map(v => parseFloat(v)) : []

  const lineData = {
    labels: notesLabels,
    datasets: [{
      label: 'Moyenne par promotion',
      data: notesValues,
      borderColor: '#198754',
      backgroundColor: 'rgba(25, 135, 84, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  }

  const doughnutData = {
    labels: presencesLabels,
    datasets: [{
      data: presencesValues,
      backgroundColor: ['#0d6efd', '#198754', '#fd7e14', '#dc3545', '#6f42c1', '#20c997'],
    }]
  }

  return (
    <div>
      <h4 className="mb-4">Tableau de bord</h4>

      <Row className="mb-4 g-3">
        {kpis.map(kpi => (
          <Col key={kpi.label} xs={12} sm={6} xl={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center gap-3">
                <div style={{
                  fontSize: '2rem',
                  backgroundColor: kpi.color + '20',
                  padding: '12px',
                  borderRadius: '12px',
                }}>
                  {kpi.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '700', color: kpi.color }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    {kpi.label}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                Moyenne par promotion
              </Card.Title>
              {notesLabels.length > 0
                ? <Line data={lineData} options={{ plugins: { legend: { display: false } } }} />
                : <p className="text-muted text-center py-4">Aucune donnée disponible</p>
              }
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                Présences par promotion
              </Card.Title>
              {presencesLabels.length > 0
                ? <Doughnut data={doughnutData} />
                : <p className="text-muted text-center py-4">Aucune donnée disponible</p>
              }
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                Taux de présence par promotion
              </Card.Title>
              {presencesLabels.length > 0
                ? <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
                : <p className="text-muted text-center py-4">Aucune donnée disponible</p>
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard