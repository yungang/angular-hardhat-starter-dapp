import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from "../../environments/environment";
import detectEthereumProvider from '@metamask/detect-provider';
import Gallery from '../../../artifacts/contracts/Gallery.sol/Gallery.json';

@Injectable({
    providedIn: 'root'
})
export class GalleryService {
    public async getAllImages(): Promise<any[]> {
        const contract = await GalleryService.getContract()
        return await contract['retrieveAllImages']()
    }

    public async getImagesByAuthor(): Promise<any[]> {
        const contract = await GalleryService.getContract(true)

        return await contract['retrieveImagesByAuthor']()
    }

    public async addImage(title: string, fileUrl: string, fileDesc: string): Promise<boolean> {
        const contract = await GalleryService.getContract(true)
        const transaction = await contract['store'](
            title,
            fileUrl,
            fileDesc
        )
        const tx = await transaction.wait()
        return tx.status === 1
    }

    private static async getContract(bySigner = false) {
        const provider = await GalleryService.getWebProvider()
        const signer = provider.getSigner()

        return new ethers.Contract(
            environment.contractAddress,
            Gallery.abi,
            bySigner ? signer : provider,
        )
    }

    private static async getWebProvider(requestAccounts = true) {
        const provider: any = await detectEthereumProvider();
        if (provider) {
            console.log('Ethereum successfully detected!');
        } else {
            console.error('Please install MetaMask!');
        }
        if (requestAccounts) {
            await provider.request({ method: 'eth_requestAccounts' });
        }

        return new ethers.providers.Web3Provider(provider);
    }
}
