import { useEffect, useState } from 'react'
import { Card, Row, Col, Tab, Tabs } from 'react-bootstrap'
import { Bar, Line } from 'react-chartjs-2'
import { getStats } from '../api'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend
)

function Statistiques() {
  const [presences, setPresences] = useState(null)
  const [notes, setNotes] = useState(null)
  const [activite, setActivite] = useState(null)

  useEffect(() => {
    getStats('presences').then(setPresences).catch(() => {})
    getStats('notes').then(setNotes).catch(() => {})
    getStats('activite').then(setActivite).catch(() => {})
  }, [])

  const presencesPromoLabels = presences ? Object.keys(presences.par_promotion) : []
  const presencesPromoValues = presences ? Object.values(presences.par_promotion).map(v => parseInt(v)) : []

  const presencesModuleLabels = presences ? Object.keys(presences.par_module) : []
  const presencesModuleValues = presences ? Object.values(presences.par_module).map(v => parseInt(v)) : []

  const notesLabels = notes ? Object.keys(notes.par_promotion) : []
  const notesValues = notes ? Object.values(notes.par_promotion).map(v => parseFloat(v)) : []

  return (
    <div>
      <h4 className="mb-4">Statistiques</h4>

      {/* Résumé global */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0d6efd' }}>
                {activite?.total_absences_enregistrees ?? '...'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Absences totales</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#198754' }}>
                {notes?.moyenne_globale ? `${notes.moyenne_globale}/20` : '...'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Moyenne globale</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fd7e14' }}>
                {activite?.tickets_en_attente ?? '...'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Tickets en attente</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Onglets */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="presences" className="mb-4">

            <Tab eventKey="presences" title="📅 Présences">
              <Row className="g-3">
                <Col xs={12} lg={6}>
                  <h6 className="text-muted mb-3">Par promotion</h6>
                  {presencesPromoLabels.length > 0
                    ? <Bar
                        data={{
                          labels: presencesPromoLabels,
                          datasets: [{ label: 'Taux (%)', data: presencesPromoValues, backgroundColor: '#0d6efd', borderRadius: 6 }]
                        }}
                        options={{ plugins: { legend: { display: false } }, scales: { y: { max: 100 } } }}
                      />
                    : <p className="text-muted text-center py-4">Aucune donnée</p>
                  }
                </Col>
                <Col xs={12} lg={6}>
                  <h6 className="text-muted mb-3">Par module</h6>
                  {presencesModuleLabels.length > 0
                    ? <Bar
                        data={{
                          labels: presencesModuleLabels,
                          datasets: [{ label: 'Taux (%)', data: presencesModuleValues, backgroundColor: '#6f42c1', borderRadius: 6 }]
                        }}
                        options={{ plugins: { legend: { display: false } }, scales: { y: { max: 100 } } }}
                      />
                    : <p className="text-muted text-center py-4">Aucune donnée</p>
                  }
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="notes" title="🎓 Notes">
              <h6 className="text-muted mb-3">Moyenne par promotion</h6>
              {notesLabels.length > 0
                ? <Line
                    data={{
                      labels: notesLabels,
                      datasets: [{
                        label: 'Moyenne /20',
                        data: notesValues,
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25,135,84,0.1)',
                        fill: true,
                        tension: 0.4,
                      }]
                    }}
                    options={{ plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 20 } } }}
                  />
                : <p className="text-muted text-center py-4">Aucune donnée</p>
              }
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Statistiques