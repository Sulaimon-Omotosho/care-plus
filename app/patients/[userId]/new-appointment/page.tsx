import AppointmentForms from '@/components/forms/AppointmentForms'
import { Button } from '@/components/ui/button'
import { getPatient } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId)
  return (
    <div className='flex h-screen max-h-screen'>
      <section className='remove-scrollbar container my-auto'>
        <div className='sub-container max-w-[860px] flex-1 justify-between'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt='Patient'
            className='mb-12 h-10 w-fit'
          />

          <AppointmentForms
            type='create'
            userId={userId}
            patientId={patient.$id}
          />

          <p className='copyright mt-10 py-12'>© 2024 CarePlus</p>
        </div>
      </section>

      <Image
        src='/assets/images/appointment-img.png'
        height={1000}
        width={1000}
        alt='Appointment'
        className='side-img max-w-[390px] bg-bottom'
      />
    </div>
  )
}

export default NewAppointment
