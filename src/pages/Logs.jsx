import { useState, useEffect, useMemo } from 'react'
import { Table, Badge, Button, Form } from 'react-bootstrap'
import { getLogs } from '../api'

const libellesAction = {
  emploi_du_temps: 'Emploi du temps',
  absences: 'Absences',
  notes: 'Notes',
  support: 'Support',
  stats: 'Stats admin',
  export: 'Export admin',
  alert: 'Alerte admin',
  ticket_create: 'Ticket créé',
  ticket_bouton: 'Clic bouton ticket',
  ping: 'Ping',
}

function libelleAction(action) {
  return libellesAction[action] || action || '—'
}

function Logs() {
  const [logs, setLogs] = useState([])
  const [filtre, setFiltre] = useState('Tous')
  const [recherche, setRecherche] = useState('')
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const charger = async () => {
    setChargement(true)
    setErreur('')
    try {
      const data = await getLogs()
      if (data.error) {
        setErreur(data.error)
        setLogs([])
      } else {
        setLogs(Array.isArray(data) ? data : [])
      }
    } catch {
      setErreur('Impossible de charger les logs. Vérifiez votre connexion.')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  const actions = useMemo(() => {
    const uniques = [...new Set(logs.map(l => l.action).filter(Boolean))]
    return uniques.sort()
  }, [logs])

  const logsFiltres = logs.filter(log => {
    if (filtre !== 'Tous' && log.action !== filtre) return false
    if (!recherche.trim()) return true
    const q = recherche.toLowerCase()
    return (
      String(log.action || '').toLowerCase().includes(q) ||
      String(log.details || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="mb-0">Journal d'activité</h4>
        <Button variant="outline-primary" size="sm" onClick={charger} disabled={chargement}>
          {chargement ? 'Chargement...' : 'Actualiser'}
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button
          variant={filtre === 'Tous' ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setFiltre('Tous')}
        >
          Tous ({logs.length})
        </Button>
        {actions.map(action => (
          <Button
            key={action}
            variant={filtre === action ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setFiltre(action)}
          >
            {libelleAction(action)} ({logs.filter(l => l.action === action).length})
          </Button>
        ))}
      </div>

      <Form.Control
        type="search"
        placeholder="Rechercher par action ou ID Discord..."
        className="mb-4"
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
        style={{ maxWidth: '400px' }}
      />

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {chargement ? (
            <div className="text-center py-5 text-muted">Chargement des logs...</div>
          ) : logsFiltres.length === 0 ? (
            <div className="text-center py-5 text-muted">Aucun log trouvé.</div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Détails (ID Discord)</th>
                </tr>
              </thead>
              <tbody>
                {logsFiltres.map((log, index) => (
                  <tr key={log.id ?? `${log.date_creation}-${index}`}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {log.date_creation
                        ? new Date(log.date_creation).toLocaleString('fr-FR')
                        : '—'}
                    </td>
                    <td>
                      <Badge bg="info" text="dark">
                        {libelleAction(log.action)}
                      </Badge>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Logs
