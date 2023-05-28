import { Component, OnInit } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { gptModels } from '../interfaces/constants';
import { ChatWithBot, ResponseModel } from '../interfaces/gpt-response';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.css']
})
export class CustomerSupportComponent implements OnInit {
chatConversation: ChatWithBot[]=[];
response!: ResponseModel | undefined;
    gptModels = gptModels
    promptText = '';
    showSpinner = false;

  constructor() { }

  ngOnInit(): void {
  }

  async checkResponse() {
    this.pushChatContent(this.promptText,'Tú','person');
    await this.invokeGPT();
    this.promptText = ""
  }


  pushChatContent(content:string, person:string, cssClass:string) {
    const chatToPush: ChatWithBot = { person:person, response:content, cssClass:cssClass};
    this.chatConversation.push(chatToPush);
  }


  getText(data:string) {
    return data.split('\n').filter(f=>f.length>0);
  }

  async invokeGPT() {
   

    if(this.promptText.length<2)
    return;

    

    try{
      this.response = undefined;
      let configuration = new Configuration({
        organization: "org-muSC3lhNKNilWWuvZHNAFtDK",
        apiKey: environment.apiKey
      });
      delete configuration.baseOptions.headers['User-Agent'];
      let openai = new OpenAIApi(configuration);

      let requestData={
        model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
        prompt: this.promptText,//this.generatePrompt(animal),
        temperature: 0.95,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };
      this.showSpinner = true;
      let apiResponse =  await openai.createCompletion(requestData);

      this.response = apiResponse.data as ResponseModel;
      this.pushChatContent(this.response.choices[0].text.trim(),'UniteAI🤖','bot');
// debugger;
      this.showSpinner = false;
    }catch(error:any) {
      this.showSpinner = false;
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        
      }
    }
  }
}
