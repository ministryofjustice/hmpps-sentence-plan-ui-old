import { bootstrapFormConfiguration, loadFormsInDirectory } from '../common/utils/forms'

const options = {
  journeyName: 'OASTUB',
  journeyTitle: 'OAStub',
  entryPoint: true,
}

const forms = loadFormsInDirectory(__dirname)

const router = bootstrapFormConfiguration(forms, options)

export default router
