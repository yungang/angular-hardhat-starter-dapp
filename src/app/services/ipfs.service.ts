import { Injectable } from "@angular/core"
import { create, globSource } from 'ipfs-http-client'
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  public async uploadFile(data: any): Promise<string> {
    let url = ''
    const client = IpfsService.getClient()
    try {
      const added = await client.add(data)
      console.log(`added: ${JSON.stringify(added)}`);

      url = `${environment.ipfs}/ipfs/${added.path}`
    } catch (error) {
      console.log(error)
    }

    return url
  }

  private static getClient(): any {
    // @ts-ignore
    return create({url: "http://127.0.0.1:5001"})
  }
}
