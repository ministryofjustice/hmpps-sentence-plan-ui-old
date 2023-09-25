import { formatName, formatDate } from '../utils/utils'
import { DeliusClient } from '../data'

interface CaseDetails {
  name: string
  crn: string
  nomsNumber?: string
  tier?: string
  dateOfBirth: string
  region?: string
  managerName: string
  inCustody: boolean
}

interface InitialAppointment {
  appointmentDate?: string
}

export default class DeliusService {
  constructor(private readonly deliusClient: DeliusClient) {
    // nothing to do
  }

  async getCaseDetails(crn: string): Promise<CaseDetails> {
    const details = await this.deliusClient.getCaseDetails(crn)
    return {
      name: formatName(details.name),
      crn: details.crn,
      nomsNumber: details.nomisId,
      tier: details.tier,
      dateOfBirth: formatDate(details.dateOfBirth),
      region: details.region,
      managerName:
        details.keyWorker != null && !details.keyWorker.unallocated
          ? formatName(details.keyWorker.name)
          : 'Unallocated',
      inCustody: details.inCustody,
    }
  }

  async getInitialAppointment(crn: string): Promise<InitialAppointment> {
    const details = await this.deliusClient.getInitialAppointmentDate(crn)
    return {
      appointmentDate: details.appointmentDate,
    }
  }
}
