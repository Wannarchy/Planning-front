import { useState, useEffect } from 'react'
import { Table, Badge, Button, Modal, Form } from 'react-bootstrap'
import { getTickets, updateTicket } from '../api'

const couleurStatut = {
  'Ouvert': 'danger',
  'En cours': 'warning',
  'Fermé': 'success',
}

function Tickets() {
  const [tickets, setTickets] = useState([])
  const [ticketSelectionne, setTicketSelectionne] = useState(null)
  const [filtre, setFiltre] = useState('Tous')
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    chargerTickets()
  }, [])

  const chargerTickets = async () => {
    setChargement(true)
    try {
      const data = await getTickets()
      setTickets(Array.isArray(data) ? data : [])
    } catch (e) {
      setErreur('Impossible de charger les tickets.')
    } finally {
      setChargement(false)
    }
  }

  const changerStatut = async (id, nouveauStatut) => {
    await updateTicket(id, nouveauStatut)
    setTickets(tickets.map(t => t.id === id ? { ...t, statut: nouveauStatut } : t))
    setTicketSelectionne(prev => prev ? { ...prev, statut: nouveauStatut } : null)
  }

  const ticketsFiltres = filtre === 'Tous'
    ? tickets
    : tickets.filter(t => t.statut === filtre)

  return (
    <div>
      <h4 className="mb-4">Gestion des tickets</h4>

      <div className="d-flex gap-2 mb-4">
        {['Tous', 'Ouvert', 'En cours', 'Fermé'].map(statut => (
          <Button
            key={statut}
            variant={filtre === statut ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setFiltre(statut)}
          >
            {statut}
          </Button>
        ))}
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {chargement ? (
            <div className="text-center py-5 text-muted">Chargement...</div>
          ) : ticketsFiltres.length === 0 ? (
            <div className="text-center py-5 text-muted">Aucun ticket trouvé.</div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>ID</th>
                  <th>Message</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ticketsFiltres.map(ticket => (
                  <tr key={ticket.id}>
                    <td className="fw-bold">#{ticket.id}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ticket.message}
                    </td>
                    <td>
                      <Badge bg={couleurStatut[ticket.statut] || 'secondary'}>
                        {ticket.statut}
                      </Badge>
                    </td>
                    <td>{ticket.date_creation ? new Date(ticket.date_creation).toLocaleDateString('fr-FR') : '-'}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => setTicketSelectionne(ticket)}>
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <Modal show={!!ticketSelectionne} onHide={() => setTicketSelectionne(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Ticket #{ticketSelectionne?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Date :</strong> {ticketSelectionne?.date_creation ? new Date(ticketSelectionne.date_creation).toLocaleDateString('fr-FR') : '-'}</p>
          <p><strong>Message :</strong> {ticketSelectionne?.message}</p>
          <p><strong>Statut actuel :</strong>{' '}
            <Badge bg={couleurStatut[ticketSelectionne?.statut] || 'secondary'}>
              {ticketSelectionne?.statut}
            </Badge>
          </p>
          <Form.Select
            className="mt-3"
            value={ticketSelectionne?.statut}
            onChange={e => changerStatut(ticketSelectionne.id, e.target.value)}
          >
            <option>Ouvert</option>
            <option>En cours</option>
            <option>Fermé</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setTicketSelectionne(null)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Tickets