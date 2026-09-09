function FeatureCard({title,description}){

return(

<div className="p-5 shadow rounded-lg">

<h2 className="text-xl font-bold">
{title}
</h2>

<p>
{description}
</p>

</div>

)

}

export default FeatureCard;