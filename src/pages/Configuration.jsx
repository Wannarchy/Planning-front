import { useState, useEffect } from 'react'
import { Card, Row, Col, Form, Button, Badge, Spinner } from 'react-bootstrap'
import { getApiStatus, getBotStatus, BASE_URL } from '../api'
import PageHeader from '../components/PageHeader'

const commandesInitiales = [
  { id: 'emploi_du_temps', label: '📅 /emploi_du_temps', description: 'Affiche l\'emploi du temps de la semaine', active: true },
  { id: 'absences', label: '🚨 /absences', description: 'Affiche le solde d\'absences', active: true },
  { id: 'notes', label: '🎓 /notes', description: 'Affiche les notes de l\'étudiant', active: true },
  { id: 'support', label: '🎫 /support', description: 'Crée un ticket de support', active: true },
  { id: 'stats', label: '📊 /stats', description: 'Affiche les statistiques (admin)', active: true },
]

const notificationsInitiales = [
  { id: 'rappel_cours', label: '📅 Rappel de cours', description: 'Envoi automatique la veille à 18h', active: true },
  { id: 'resume_hebdo', label: '📊 Résumé hebdomadaire', description: 'Envoi chaque dimanche à 20h', active: true },
  { id: 'nouvelle_note', label: '🎓 Nouvelle note', description: 'Notification en temps réel via Realtime', active: true },
]

function BadgeStatut({ ok, labelOk = 'Connecté', labelKo = 'Hors ligne' }) {
  return <Badge bg={ok ? 'success' : 'danger'}>{ok ? labelOk : labelKo}</Badge>
}

function Configuration() {
  const [commandes, setCommandes] = useState(commandesInitiales)
  const [notifications, setNotifications] = useState(notificationsInitiales)
  const [sauvegarde, setSauvegarde] = useState(false)
  const [statut, setStatut] = useState(null)
  const [chargementStatut, setChargementStatut] = useState(true)

  const verifierConnexions = async () => {
    setChargementStatut(true)
    try {
      const [api, bot] = await Promise.all([
        getApiStatus().catch(() => ({ ok: false })),
        getBotStatus().catch(() => null),
      ])
      setStatut({ api, bot })
    } finally {
      setChargementStatut(false)
    }
  }

  useEffect(() => {
    verifierConnexions()
  }, [])

  const botConnecte = statut?.bot?.botHttp?.connected === true
  const apiOk = statut?.api?.status === 'OK'
  const supabaseOk = statut?.bot?.supabase?.ok === true
  const tokenBotOk = statut?.bot?.discord?.ok === true

  return (
    <div className="page">
      <PageHeader title="Configuration" subtitle="État du système et paramètres">
        <Button variant="outline-secondary" size="sm" onClick={verifierConnexions} disabled={chargementStatut}>
          {chargementStatut ? <Spinner size="sm" /> : '🔄'} Vérifier
        </Button>
        <Button
          variant={sauvegarde ? 'success' : 'primary'}
          size="sm"
          onClick={() => { setSauvegarde(true); setTimeout(() => setSauvegarde(false), 2000) }}
        >
          {sauvegarde ? '✅ Sauvegardé' : '💾 Sauvegarder'}
        </Button>
      </PageHeader>

      <Card className="admin-card mb-4">
        <Card.Body>
          <Card.Title className="mb-3">État des connexions</Card.Title>
          {chargementStatut && !statut ? (
            <div className="text-muted">Vérification en cours...</div>
          ) : (
            <Row className="g-3">
              <Col xs={12} sm={6} lg={3}>
                <div className="conn-card" style={{ backgroundColor: '#5865f212' }}>
                  <div className="conn-card-header">
                    <span className="conn-card-label">API Backend</span>
                    <BadgeStatut ok={apiOk} />
                  </div>
                  <div className="conn-card-detail">{BASE_URL.replace('/api', '')}</div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <div className="conn-card" style={{ backgroundColor: '#19875412' }}>
                  <div className="conn-card-header">
                    <span className="conn-card-label">Supabase</span>
                    <BadgeStatut ok={supabaseOk} />
                  </div>
                  <div className="conn-card-detail">
                    {supabaseOk ? 'Lecture OK' : statut?.bot?.supabase?.error || 'Erreur'}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <div className="conn-card" style={{ backgroundColor: '#5865f212' }}>
                  <div className="conn-card-header">
                    <span className="conn-card-label">Token Discord</span>
                    <BadgeStatut ok={tokenBotOk} labelOk="Valide" labelKo="Invalide" />
                  </div>
                  <div className="conn-card-detail">
                    {tokenBotOk ? `@${statut.bot.discord.username}` : '—'}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <div className="conn-card" style={{ backgroundColor: '#fd7e1412' }}>
                  <div className="conn-card-header">
                    <span className="conn-card-label">Bot en ligne</span>
                    <BadgeStatut ok={botConnecte} labelOk="En ligne" labelKo="Hors ligne" />
                  </div>
                  <div className="conn-card-detail">
                    {botConnecte ? statut.bot.botHttp.tag : 'Non disponible'}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card className="admin-card h-100">
            <Card.Body>
              <Card.Title className="mb-4">Commandes du bot</Card.Title>
              {commandes.map(cmd => (
                <div key={cmd.id} className="d-flex justify-content-between align-items-center mb-3 pb-3"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="pe-2">
                    <div className="fw-semibold">{cmd.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cmd.description}</div>
                  </div>
                  <Form.Check
                    type="switch"
                    checked={cmd.active}
                    onChange={() => setCommandes(commandes.map(c => c.id === cmd.id ? { ...c, active: !c.active } : c))}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="admin-card h-100">
            <Card.Body>
              <Card.Title className="mb-4">Notifications automatiques</Card.Title>
              {notifications.map(notif => (
                <div key={notif.id} className="d-flex justify-content-between align-items-center mb-3 pb-3"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="pe-2">
                    <div className="fw-semibold">{notif.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{notif.description}</div>
                  </div>
                  <Form.Check
                    type="switch"
                    checked={notif.active}
                    onChange={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, active: !n.active } : n))}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Configuration
