import { useState } from 'react'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'

const commandesInitiales = [
  { id: 'emploi_du_temps', label: '📅 !emploi-du-temps', description: 'Affiche l\'emploi du temps de la semaine', active: true },
  { id: 'absences', label: '🚨 !absences', description: 'Affiche le solde d\'absences', active: true },
  { id: 'notes', label: '🎓 !notes', description: 'Affiche les notes de l\'étudiant', active: true },
  { id: 'support', label: '🎫 !support', description: 'Crée un ticket de support', active: true },
  { id: 'stats', label: '📊 !stats', description: 'Affiche les statistiques (admin)', active: false },
]

const notificationsInitiales = [
  { id: 'rappel_cours', label: '📅 Rappel de cours', description: 'Envoi automatique la veille à 18h', active: true },
  { id: 'resume_hebdo', label: '📊 Résumé hebdomadaire', description: 'Envoi chaque dimanche à 20h', active: true },
  { id: 'nouvelle_note', label: '🎓 Nouvelle note', description: 'Notification en temps réel', active: false },
]

function Configuration() {
  const [commandes, setCommandes] = useState(commandesInitiales)
  const [notifications, setNotifications] = useState(notificationsInitiales)
  const [sauvegarde, setSauvegarde] = useState(false)

  const toggleCommande = (id) => {
    setCommandes(commandes.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  const toggleNotification = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, active: !n.active } : n))
  }

  const handleSauvegarder = () => {
    setSauvegarde(true)
    setTimeout(() => setSauvegarde(false), 2000)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Configuration</h4>
        <Button
          variant={sauvegarde ? 'success' : 'primary'}
          onClick={handleSauvegarder}
        >
          {sauvegarde ? '✅ Sauvegardé !' : '💾 Sauvegarder'}
        </Button>
      </div>

      <Row className="g-3">

        {/* Commandes bot */}
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-4">🤖 Commandes du bot</Card.Title>
              {commandes.map(cmd => (
                <div key={cmd.id} className="d-flex justify-content-between align-items-center mb-3 pb-3"
                  style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div className="fw-semibold">{cmd.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{cmd.description}</div>
                  </div>
                  <Form.Check
                    type="switch"
                    checked={cmd.active}
                    onChange={() => toggleCommande(cmd.id)}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Notifications */}
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-4">🔔 Notifications automatiques</Card.Title>
              {notifications.map(notif => (
                <div key={notif.id} className="d-flex justify-content-between align-items-center mb-3 pb-3"
                  style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div className="fw-semibold">{notif.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{notif.description}</div>
                  </div>
                  <Form.Check
                    type="switch"
                    checked={notif.active}
                    onChange={() => toggleNotification(notif.id)}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Infos système */}
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">⚙️ Informations système</Card.Title>
              <Row className="g-3">
                {[
                  { label: 'Backend', value: 'http://localhost:8080', color: '#198754' },
                  { label: 'Base de données', value: 'Supabase (PostgreSQL)', color: '#0d6efd' },
                  { label: 'Frontend', value: 'http://localhost:5173', color: '#6f42c1' },
                  { label: 'Bot Discord', value: 'http://localhost:3001', color: '#fd7e14' },
                ].map(info => (
                  <Col key={info.label} xs={12} sm={6} lg={3}>
                    <div className="p-3 rounded" style={{ backgroundColor: info.color + '15' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '4px' }}>{info.label}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: info.color }}>{info.value}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  )
}

export default Configuration