'use client'
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import DonutChart from 'react-donut-chart';
import { PieChart } from 'react-minimal-pie-chart';

export default function Home() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [linkInput,setLinkInput] = useState("");

  const [outputHS,setOutputHS] = useState(null);
  const [outputHSEmotion,setOutputHSEmotion] = useState(null);
  const [outputComments,setOutputComments] = useState(null);
  const [purify,setPurify] = useState(null);

  const baseUrl = 'http://3.86.243.128/'

  const handleImageChange = (event) => {
    console.log("File input changed");
    const selectedImage = event.target.files[0];
    console.log("Selected image:", selectedImage);
    setImage(selectedImage);

  };

  const [outputOfHS, setOutputOfHS] = useState(null);
  useEffect(() => {
    // When outputHS changes, update outputOfHS
    if (outputHS && outputHS.length > 0) {
      const formattedData = outputHS.map((response, index) => ({
        id: index,
        label: `Response ${index + 1}`,
        values: response.map(item => ({
          label: item.label,
          score: item.score
        }))
      }));
      setOutputOfHS(formattedData);
    }
  }, [outputHS]);


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 15000); 

    return () => clearTimeout(timer);
  }, [loading]);

  const [pornModeration,setPornModeration] = useState(null);
  const [suggestive_nudity_Moderation,setSuggestive_nudity_Moderation] = useState(null);
  const [goreModeration,setGoreModeration] = useState(null);
  const [moneyModeration,setMoneyModeration] = useState(null);
  const [weaponModeration,setWeaponModeration] = useState(null);
  const [drugModeration,setDrugModeration] = useState(null);
  const [hate_signModeration,setHate_signModeration] = useState(null);
  const [obscene_gestureModeration,setObscene_gestureModeration] = useState(null);

  const [reject,setReject] = useState(null);

  useEffect(()=>{
    console.log(outputComments);
  },[outputComments]);

  const MakeRequest = async()=>{
    setLoading(true);
    if(image!==null){
      try {
        const formData = new FormData();
        formData.append('input', image);
        
        const response = await axios.post(baseUrl+'/api/hate-speech/',formData); 
        if(response.data.status===200){
          setOutputHS(response.data.response);
          setOutputHSEmotion(response.data.emotion)
        }else if(response.data.status===400){
          alert("Please Wait!!! Model is loading...")
          setTimeout(() => {
            setLoading(false);
          }, 4000); 
          // MakeRequest();
          // return;
        }
      } catch (error) {
        alert(error)
        return;
      }
    }else{
      // alert('Invalid Image!!!');
    }

    if(linkInput!==""){
      try {
        const response = await axios.post(baseUrl+'/api/get-comments/',{link:linkInput})
        if(response.data.status===200){
          setOutputComments(response.data.output);
        }else{
          // alert('Error')
        }
      } catch (error) {
        alert(error);
      }
    }

    if(image!==null){
      try {
        const formData = new FormData();
        formData.append('input', image);

        const response = await axios.post(baseUrl+'/api/purify/',formData);
        if(response.data.status===200){
          setPurify(response.data.data);
          
          setPornModeration({title:'porn_moderation',confidence:response.data.data.porn_moderation.confidence_score,detection:response.data.data.porn_moderation.porn_content});
          setSuggestive_nudity_Moderation({title:'suggestive_nudity_moderation',confidence:response.data.data.suggestive_nudity_moderation.confidence_score,detection:response.data.data.suggestive_nudity_moderation.suggestive_nudity_content});
          setGoreModeration({title:'gore_moderation',confidence:response.data.data.gore_moderation.confidence_score,detection:response.data.data.gore_moderation.gore_content})
          setMoneyModeration({title:'money_moderation',confidence:response.data.data.money_moderation.confidence_score,detection:response.data.data.money_moderation.money_content})
          setWeaponModeration({title:'weapon_moderation',confidence:response.data.data.weapon_moderation.confidence_score,detection:response.data.data.weapon_moderation.weapon_content})
          setDrugModeration({title:'drug_moderation',confidence:response.data.data.drug_moderation.confidence_score,detection:response.data.data.drug_moderation.drug_content})
          setHate_signModeration({title:'hate_sign_moderation',confidence:response.data.data.hate_sign_moderation.confidence_score,detection:response.data.data.hate_sign_moderation.hate_sign_content})
          setObscene_gestureModeration({title:'obscene_gesture_moderation',confidence:response.data.data.obscene_gesture_moderation.confidence_score,detection:response.data.data.obscene_gesture_moderation.obscene_gesture_content})
   
          setReject(response.data.data.reject_criteria)
        }
      } catch (error) {
        alert(error);
      }
    }
  }




  return (
    <div className="w-screen min-h-screen bg-white text-black font-sans">
        <div className="text-3xl font-sans font-semibold  pt-3 mb-2 text-center">Sentimental Shield</div>

      {(!loading)?
      <div className="flex flex-col justify-center items-center py-10">

        <div className="text-xl font-sans font-semibold mb-4 text-center">Image Input</div>
        <div className="text-center">
          <label htmlFor="fileInput" className="block cursor-pointer">
            <input
              id="fileInput"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="block border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 hover:bg-gray-50">
              {(image)?<>{image.name}</>:<>Select Image</>}
            </span>
          </label>

          <h1 className='text-xl font-sans font-semibold mb-4 text-center pt-8'>Link Input</h1>
          <input type='text' className='border border-gray-300 rounded-lg text-center h-12 w-60' onChange={(e)=>{setLinkInput(e.target.value); console.log(linkInput)}}/>

         <div className='pt-8'> <button onClick={()=>{MakeRequest()}} className='bg-slate-700 text-white font-sans font-semibold px-8 py-2 rounded-lg'>Submit</button></div>
        </div>

        <div className='flex w-screen justify-center items-center'>
        {/* //Output  */}
        <div className='w-1/2 flex justify-center'>
          {(outputHS && outputHS.length > 0) ?
            outputHS.map((response, index) => (
              <div key={index}>
                <h1 className='text-center pt-10 font-semibold text-xl'>Hate-Speech In Text:</h1>
                <ul>
                  {response.map((item, i) => (
                    // <li key={i}>{item.label}: {item.score}</li>
                    <div className='w-full flex justify-center pt-4'>
                    <div className="w-full">
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{item.label}</h3>
                            <span className="font-semibold">{(item.score*100).toFixed(2)}</span>
                        </div>
                        <div className="h-5  bg-slate-400 rounded-sm hover:bg-slate-300">
                            <span className="block h-full bg-slate-600 rounded-sm hover:bg-slate-500" style={{ width: `${(item.score*100)}%` }}></span>
                        </div>
                    </div>
                    </div>
                  ))}
                </ul>
              </div>
            ))
            :
            <></>
          }

        </div>

          <div className='w-1/2'>
            {(outputHSEmotion && outputHSEmotion.length > 0) ?
              <MyDonutChart data={outputHSEmotion[0]} />
              :
              <></>
            }
          </div>
        </div>

        <div>
          {outputComments && outputComments.length > 0 ? (
            <div>
        <h1 className='text-center py-10 font-semibold text-xl'>Sentiment-Analysis On Comments:</h1>
            
            <div className='w-screen flex justify-center'>
            <div className='flex justify-center items-center w-[80%]'>
                <div className='w-1/2'>
                  <div className='flex  items-center py-4'>
                      <div className='w-7 h-7 bg-[#8d9aa6] mx-2'></div>
                      <h3>Negative: {outputComments[0]['neg'] * 100}</h3>
                  </div>

                  <div className='flex  items-center py-4'>
                      <div className='w-7 h-7 bg-[#6B7280] mx-2'></div>
                      <h3>Neutral: {outputComments[0]['neu'] * 100}</h3>
                  </div>

                  <div className='flex  items-center py-4'>
                      <div className='w-7 h-7 bg-[#4e5a65] mx-2'></div>
                      <h3>Positive: {outputComments[0]['pos'] * 100}</h3>
                  </div>

                </div>

                <div className='w-1/5'>
                <PieChart
                  data={[
                    { title: 'Negative', value: outputComments[0]['neg'] * 100, color: '#8d9aa6' },
                    { title: 'Neutral', value: outputComments[0]['neu'] * 100, color: '#6B7280' },
                    { title: 'Positive', value: outputComments[0]['pos'] * 100, color: '#4e5a65' },
                  ]}
                  animationDuration={[500]}
                />
                </div>
            </div>
          </div>
          </div>
          ) : (
            <></>
          )}

          <div className='pt-10'>
            
            {purify!==null?(
              <>

                <div>
                  {reject !== null ? (
                    <>
                      <h1 className='text-xl py-4 font-sans text-center font-semibold'>Image Analysis</h1>
                      <div className='font-sans text-center text-lg'>
                        {(reject && reject.length>0)?<>Rejection_criteria: </>:<></>}
                        {reject.map((item, index) => (
                          <div key={index}>{item}</div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                
                <div className='flex flex-wrap pt-6 justify-center items-center gap-6'>
                  
                

               {(pornModeration!==null)?
               <PurifyDataComponent
                title={pornModeration.title}
                confidence={pornModeration.confidence}
                detection={pornModeration.detection}
              />

              :<></>}
              
              {(suggestive_nudity_Moderation!==null)?
              <PurifyDataComponent
                title={suggestive_nudity_Moderation.title}
                confidence={suggestive_nudity_Moderation.confidence}
                detection={suggestive_nudity_Moderation.detection}
              />
      
              :<></>}

            {(goreModeration!==null)?
              <PurifyDataComponent
                title={goreModeration.title}
                confidence={goreModeration.confidence}
                detection={goreModeration.detection}
              />
      
              :<></>} 

              {(moneyModeration!==null)?
              <PurifyDataComponent
                title={moneyModeration.title}
                confidence={moneyModeration.confidence}
                detection={moneyModeration.detection}
              />
      
              :<></>} 


            {(weaponModeration!==null)?
              <PurifyDataComponent
                title={weaponModeration.title}
                confidence={weaponModeration.confidence}
                detection={weaponModeration.detection}
              />
      
              :<></>} 

            {(drugModeration!==null)?
              <PurifyDataComponent
                title={drugModeration.title}
                confidence={drugModeration.confidence}
                detection={drugModeration.detection}
              />
      
              :<></>} 

            {(hate_signModeration!==null)?
              <PurifyDataComponent
                title={hate_signModeration.title}
                confidence={hate_signModeration.confidence}
                detection={hate_signModeration.detection}
              />
      
              :<></>} 


            {(obscene_gestureModeration!==null)?
              <PurifyDataComponent
                title={obscene_gestureModeration.title}
                confidence={obscene_gestureModeration.confidence}
                detection={obscene_gestureModeration.detection}
              />
      
              :<></>} 

              </div>
              </> 
            ):<></>}
          </div>
        </div>

      </div>:
      <div className='flex justify-center items-center h-screen'>
        <div>
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-900"></div>
          <h1 className='text-center text-xl font-semibold pt-4'>Loading...</h1>
        </div>    
      </div>
      }
    </div>
  );
}

const MyDonutChart = ({ data }) => {
  // Calculate percentage values for each label
  const total = data.reduce((acc, curr) => acc + curr.score, 0);
  const label1Percentage = (data.find(item => item.label === 'LABEL_1').score / total) * 100;
  const label0Percentage = (data.find(item => item.label === 'LABEL_0').score / total) * 100;

  return (
    <>
      <h1 className='text-center py-10 font-semibold text-xl'>Sentiment In Text:</h1>
        <DonutChart
        data={[
          {
            label: 'Positive',
            value: Math.floor(label1Percentage),
          },
          {
            label: 'Negative',
            value: Math.floor(label0Percentage),
          },
         
        ]}
        colors={[
          '#4B5563','#6B7280'
        ]}
      />
        
      
    </>
  );
};



const PurifyDataComponent = ({ title, confidence, detection }) => {
  return (
    <div className='py-4 font-sans font-medium px-6 border-2 rounded-md'>
      <h2 className='text-lg pt-1'>{title}</h2>
      <p className='text-md pt-1'>Confidence: {confidence}</p>
      <p className='text-md pt-1'>Detection: {detection ? 'True' : 'False'}</p>
    </div>
  );
};

