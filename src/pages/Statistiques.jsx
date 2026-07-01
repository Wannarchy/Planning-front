import { useEffect, useState, useMemo } from 'react'
import { Card, Row, Col, Tab, Tabs, Table, Button, Badge, Spinner } from 'react-bootstrap'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { getStats } from '../api'
import PageHeader from '../components/PageHeader'
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

const COULEURS = ['#0d6efd', '#198754', '#fd7e14', '#dc3545', '#6f42c1', '#20c997', '#0dcaf0', '#ffc107']

const optionsBar = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => `${v}%` } } },
}

const optionsNotes = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 20 } },
}

function parsePourcent(v) {
  if (typeof v === 'number') return v
  return parseInt(String(v).replace('%', ''), 10) || 0
}

function TableauRecap({ colonnes, lignes }) {
  if (!lignes.length) return <p className="empty-state py-3 mb-0">Aucune donnée</p>
  return (
    <div className="table-wrap">
      <Table size="sm" hover className="mb-0">
        <thead>
          <tr>
            {colonnes.map(c => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {lignes.map(([label, value]) => (
            <tr key={label}>
              <td className="fw-semibold">{label}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

function Statistiques() {
  const [presences, setPresences] = useState(null)
  const [notes, setNotes] = useState(null)
  const [activite, setActivite] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const charger = async () => {
    setChargement(true)
    setErreur('')
    try {
      const [p, n, a] = await Promise.all([
        getStats('presences'),
        getStats('notes'),
        getStats('activite'),
      ])
      if (p.error || n.error || a.error) {
        setErreur('Impossible de charger certaines statistiques.')
      }
      setPresences(p.error ? null : p)
      setNotes(n.error ? null : n)
      setActivite(a.error ? null : a)
    } catch {
      setErreur('Erreur de connexion à l\'API.')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  const presencesPromo = useMemo(() => {
    if (!presences?.par_promotion) return { labels: [], values: [], lignes: [] }
    const labels = Object.keys(presences.par_promotion)
    const values = Object.values(presences.par_promotion).map(parsePourcent)
    const lignes = labels.map((l, i) => [l, `${values[i]}%`])
    return { labels, values, lignes }
  }, [presences])

  const presencesModule = useMemo(() => {
    if (!presences?.par_module) return { labels: [], values: [], lignes: [] }
    const labels = Object.keys(presences.par_module)
    const values = Object.values(presences.par_module).map(parsePourcent)
    const lignes = labels.map((l, i) => [l, `${values[i]}%`])
    return { labels, values, lignes }
  }, [presences])

  const notesPromo = useMemo(() => {
    if (!notes?.par_promotion) return { labels: [], values: [], lignes: [] }
    const labels = Object.keys(notes.par_promotion)
    const values = Object.values(notes.par_promotion).map(v => parseFloat(v))
    const lignes = labels.map((l, i) => [l, `${values[i].toFixed(2)}/20`])
    return { labels, values, lignes }
  }, [notes])

  const kpis = [
    {
      label: 'Absences enregistrées',
      value: activite?.total_absences_enregistrees ?? '—',
      icon: '🚨',
      color: '#fd7e14',
    },
    {
      label: 'Notes enregistrées',
      value: activite?.total_notes_enregistrees ?? '—',
      icon: '🎓',
      color: '#198754',
    },
    {
      label: 'Moyenne globale',
      value: notes?.moyenne_globale ? `${notes.moyenne_globale}/20` : '—',
      icon: '📊',
      color: '#0d6efd',
    },
    {
      label: 'Tickets en attente',
      value: activite?.tickets_en_attente ?? '—',
      icon: '🎫',
      color: '#dc3545',
    },
  ]

  const meilleurePromo = notesPromo.lignes.length
    ? notesPromo.lignes.reduce((best, cur) => (parseFloat(cur[1]) > parseFloat(best[1]) ? cur : best))
    : null

  const pirePresence = presencesPromo.lignes.length
    ? presencesPromo.lignes.reduce((worst, cur) => (parseInt(cur[1]) < parseInt(worst[1]) ? cur : worst))
    : null

  return (
    <div className="page">
      <PageHeader title="Statistiques" subtitle="Analyses détaillées par promotion et module">
        <Button variant="outline-primary" size="sm" onClick={charger} disabled={chargement}>
          {chargement ? <><Spinner size="sm" className="me-1" /> Chargement...</> : 'Actualiser'}
        </Button>
      </PageHeader>

      {erreur && <div className="alert alert-warning">{erreur}</div>}

      <Row className="kpi-grid g-3">
        {kpis.map(kpi => (
          <Col key={kpi.label} xs={12} sm={6} xl={3}>
            <Card className="kpi-card">
              <Card.Body>
                <div className="kpi-icon" style={{ backgroundColor: kpi.color + '18' }}>
                  {kpi.icon}
                </div>
                <div>
                  <div className="kpi-value" style={{ color: kpi.color }}>
                    {chargement ? '...' : kpi.value}
                  </div>
                  <div className="kpi-label">{kpi.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {!chargement && (meilleurePromo || pirePresence) && (
        <Row className="mb-4 g-3">
          {meilleurePromo && (
            <Col xs={12} md={6}>
              <Card className="admin-card border-start border-4 border-success">
                <Card.Body className="py-3">
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>Meilleure moyenne</span>
                  <div className="fw-bold">{meilleurePromo[0]} — {meilleurePromo[1]}</div>
                </Card.Body>
              </Card>
            </Col>
          )}
          {pirePresence && (
            <Col xs={12} md={6}>
              <Card className="admin-card border-start border-4 border-warning">
                <Card.Body className="py-3">
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>Présence la plus faible</span>
                  <div className="fw-bold">{pirePresence[0]} — {pirePresence[1]}</div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      <Card className="admin-card">
        <Card.Body>
          <Tabs defaultActiveKey="presences" className="mb-3">
            <Tab eventKey="presences" title="Présences">
              <Row className="g-4 mt-1">
                <Col xs={12} lg={7}>
                  <h6 className="text-muted mb-3">Taux de présence par promotion</h6>
                  {presencesPromo.labels.length > 0 ? (
                    <Bar
                      data={{
                        labels: presencesPromo.labels,
                        datasets: [{
                          label: 'Taux (%)',
                          data: presencesPromo.values,
                          backgroundColor: COULEURS.slice(0, presencesPromo.labels.length),
                          borderRadius: 6,
                        }],
                      }}
                      options={optionsBar}
                    />
                  ) : (
                    <p className="text-muted text-center py-5">Aucune donnée de présence</p>
                  )}
                </Col>
                <Col xs={12} lg={5}>
                  <h6 className="text-muted mb-3">Répartition</h6>
                  {presencesPromo.labels.length > 0 ? (
                    <Doughnut
                      data={{
                        labels: presencesPromo.labels,
                        datasets: [{
                          data: presencesPromo.values,
                          backgroundColor: COULEURS.slice(0, presencesPromo.labels.length),
                        }],
                      }}
                    />
                  ) : (
                    <p className="text-muted text-center py-5">—</p>
                  )}
                </Col>
                <Col xs={12} lg={6}>
                  <h6 className="text-muted mb-2">Détail par promotion</h6>
                  <div className="card border-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <TableauRecap colonnes={['Promotion', 'Taux']} lignes={presencesPromo.lignes} />
                  </div>
                </Col>
                <Col xs={12} lg={6}>
                  <h6 className="text-muted mb-2">Détail par module</h6>
                  <div className="card border-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <TableauRecap colonnes={['Module', 'Taux']} lignes={presencesModule.lignes} />
                  </div>
                </Col>
                {presencesModule.labels.length > 0 && (
                  <Col xs={12}>
                    <h6 className="text-muted mb-3">Présence par module</h6>
                    <Bar
                      data={{
                        labels: presencesModule.labels,
                        datasets: [{
                          label: 'Taux (%)',
                          data: presencesModule.values,
                          backgroundColor: '#6f42c1',
                          borderRadius: 6,
                        }],
                      }}
                      options={{ ...optionsBar, indexAxis: 'y' }}
                    />
                  </Col>
                )}
              </Row>
            </Tab>

            <Tab eventKey="notes" title="Notes">
              <Row className="g-4 mt-1">
                <Col xs={12} lg={8}>
                  <h6 className="text-muted mb-3">Moyenne par promotion</h6>
                  {notesPromo.labels.length > 0 ? (
                    <Line
                      data={{
                        labels: notesPromo.labels,
                        datasets: [{
                          label: 'Moyenne /20',
                          data: notesPromo.values,
                          borderColor: '#198754',
                          backgroundColor: 'rgba(25, 135, 84, 0.12)',
                          fill: true,
                          tension: 0.35,
                          pointRadius: 5,
                          pointBackgroundColor: '#198754',
                        }],
                      }}
                      options={optionsNotes}
                    />
                  ) : (
                    <p className="text-muted text-center py-5">Aucune note enregistrée</p>
                  )}
                </Col>
                <Col xs={12} lg={4}>
                  <Card className="border-0 h-100" style={{ backgroundColor: '#19875412' }}>
                    <Card.Body className="d-flex flex-column justify-content-center text-center">
                      <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Moyenne globale</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#198754' }}>
                        {notes?.moyenne_globale ?? '—'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>/ 20</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12}>
                  <h6 className="text-muted mb-2">Classement par promotion</h6>
                  <div className="card border-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <TableauRecap colonnes={['Promotion', 'Moyenne']} lignes={
                      [...notesPromo.lignes].sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                    } />
                  </div>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="activite" title="Activité">
              <Row className="g-3 mt-1">
                {[
                  { label: 'Tickets en attente', value: activite?.tickets_en_attente, badge: 'danger' },
                  { label: 'Total absences', value: activite?.total_absences_enregistrees, badge: 'warning' },
                  { label: 'Total notes', value: activite?.total_notes_enregistrees, badge: 'success' },
                  {
                    label: 'Uptime API',
                    value: activite?.bot_uptime != null
                      ? `${Math.floor(activite.bot_uptime / 3600)}h ${Math.floor((activite.bot_uptime % 3600) / 60)}m`
                      : '—',
                    badge: 'primary',
                  },
                ].map(item => (
                  <Col key={item.label} xs={12} sm={6} lg={3}>
                    <Card className="admin-card">
                      <Card.Body>
                        <div className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>{item.label}</div>
                        <Badge bg={item.badge} style={{ fontSize: '1.1rem', padding: '8px 14px' }}>
                          {chargement ? '...' : (item.value ?? '—')}
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Statistiques
