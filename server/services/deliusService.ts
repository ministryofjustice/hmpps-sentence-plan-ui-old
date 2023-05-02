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
}

export default class DeliusService {
  constructor(private readonly deliusClient: DeliusClient) {}

  async getCaseDetails(crn: string): Promise<CaseDetails> {
    const details = await this.deliusClient.getCaseDetails(crn)
    return {
      name: formatName(details.name),
      crn: details.crn,
      nomsNumber: details.nomsNumber,
      tier: details.tier,
      dateOfBirth: formatDate(details.dateOfBirth),
      region: details.region,
      managerName:
        details.keyWorker != null && !details.keyWorker.unallocated
          ? formatName(details.keyWorker.name)
          : 'Unallocated',
    }
  }
}
