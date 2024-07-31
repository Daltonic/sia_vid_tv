import { subscriptionPlans } from '@/app/data/subscriptions'
import { FaRegCheckCircle } from 'react-icons/fa'

const Subcriptions = () => {
  return (
    <div className="mt-20">
      <div className="text-center sm:w-1/2 mx-auto my-14">
        <h1 className="text-xl sm:text-3xl text-white">Choose Your Best</h1>
        <p className="text-slate-200">
          Enjoy various films that we have recommended for you and your family
          to enjoy
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Subscription key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}

const Subscription = ({ plan }: { plan: any }) => {
  return (
    <div
      className="relative border border-slate-500 rounded-lg p-6 bg-slate-800
      bg-opacity-25 shadow-lg hover:scale-105 transition ease-out duration-300
      flex flex-col justify-between"
    >
      <>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
          <p className="text-sm text-slate-200 mb-4 w-3/4 mx-auto">
            {plan.description}
          </p>
          <p className="text-4xl font-bold text-green-500 my-8">
            {plan.price}{' '}
            <span className="text-sm text-slate-200">{plan.duration}</span>
          </p>
        </div>

        <div className="mb-4 h-52 text-slate-200">
          {plan.details.map((detail: any, index: number) => (
            <div key={index} className="mb-2 flex items-center gap-2">
              <FaRegCheckCircle className="text-green-500" /> <p> {detail}</p>
            </div>
          ))}
        </div>
      </>

      <button
        className="w-full bg-green-500 text-white py-4 rounded-lg hover:bg-transparent
      hover:border-green-800 hover:border hover:text-green-500"
      >
        Choose Plan
      </button>
    </div>
  )
}

export default Subcriptions
