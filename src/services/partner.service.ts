import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import partnerRepository from "../repositories/partner.repository";
import xlsx from "xlsx";
import fs from "fs";


const partnerService = {
  partnerAddSellersViaForm: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.body.sellerId, req.user.id);

    if (seller) return message.SELLER_ALREADY_EXIST;

    const dataToCreate = {
      ...req.body,
      partnerId: req.user.id
    };

    const createdSelller = await partnerRepository.partnerAddSellersViaForm(dataToCreate);

    if (!createdSelller) return message.FAILED;

    return createdSelller;
  },

  updateSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.params.sellerId, req.user.id);

    if (!seller) return message.SELLER_NOT_FOUND;

    const updatedSelller = await partnerRepository.updateSellerAddedByPartner(req.body, req.params.sellerId);

    if (!updatedSelller) return message.FAILED;

    return updatedSelller;
  },

  deleteSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.params.sellerId, req.user.id);

    if (!seller) return message.SELLER_NOT_FOUND;

    const deletedSelller = await partnerRepository.deleteSellerAddedByPartner(req.params.sellerId);

    if (!deletedSelller) return message.FAILED;

    return deletedSelller;
  },

  fetchSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.params.sellerId, req.user.id);

    if (!seller) return message.SELLER_NOT_FOUND;

    const encryptedPassword = helper.encrypt(seller.password)

    seller.password = encryptedPassword;

    return seller;
  },

  fetchAllSellersAddedByPartner: async (req: any) => {
    let sellersData = await partnerRepository.fetchAllSellersAddedByPartner(req.user.id);
    console.log("🚀 ~ sellersData:", sellersData)

    sellersData = sellersData.map((seller: any) => ({
      ...seller,
      password: helper.encrypt(seller.password)
    }));

    return sellersData;
  },

  addSellersByPartnerUsingFile: async (req: any) => {
    console.log("req.file: ", req.file);

    if (!req.file) {
      return "Please provide a excel file to upload data!"
    }

    const filePath = req.file.path;

    let eventsData: any[] = [];

    let workBook: xlsx.WorkBook;
    // console.log("🚀 ~ workBook: ", workBook)
    
    if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      workBook = xlsx.readFile(filePath);
    } else if (req.file.mimetype === "text/csv") {
      const csvBuffer = fs.readFileSync(filePath, { encoding: "utf8" });
      workBook = xlsx.read(csvBuffer, { type: "string" });
    } else {
      return "Unsupported file format. Please upload an XLSX or CSV file.";
    }
    
    console.log("🚀 ~ workBook after: ", workBook)

    const sheetName = workBook.SheetNames[0];
    console.log("🚀 ~ sheetName: ", sheetName)

    const sheet = workBook.Sheets[sheetName];
    console.log("🚀 ~ sheet: ", sheet)

    const data: any[] = xlsx.utils.sheet_to_json(sheet);
    console.log("🚀 ~ data: ", data)
    
    if (!data.length) {
      return "No data found in the uploaded file!";
    }
    console.log("🚀 ~ data after: ", data)

    
    const ifEmptySpaceAvailableInData = data.find((item: any) => Object.keys(item).some((key: string) => key.includes("__EMPTY_")));
    console.log("🚀 ~ ifEmptySpaceAvailableInData:", ifEmptySpaceAvailableInData)
    
    
    if (!ifEmptySpaceAvailableInData) {
      eventsData = data;
    } else {
      eventsData = data.map((item: any) => {
        const emptyKeyNames = Object.keys(item);
        console.log("🚀 ~ emptyKeyNames:", emptyKeyNames)
        return {
          sellerId: item[emptyKeyNames[0]],
          sellerName: item[emptyKeyNames[1]],
          brandName: item[emptyKeyNames[2]],
          launchingDate: item[emptyKeyNames[3]],
          listingDate: item[emptyKeyNames[4]],
          sellerEmailId: item[emptyKeyNames[5]],
          phoneNumber: item[emptyKeyNames[6]],
          password: item[emptyKeyNames[7]],
          brandApproval: item[emptyKeyNames[8]],
          gstNumber: item[emptyKeyNames[9]],
          trademarkClass: item[emptyKeyNames[10]],
          productCategories: item[emptyKeyNames[11]],
        };
      }).filter((_, index) => index > 0);
    }
    
    console.log("🚀 ~ eventsData:", eventsData)
    return;

    // eventsData = eventsData.map((event: any) => {
    //   const formatLanguagesArray = (languages: string) => {
    //     let formattedArray: string[] = [];
    //     if (!languages || (Array.isArray(languages) && !languages.length) || languages === " ") {
    //       formattedArray = [];
    //     } else if (languages.includes(", ")) {
    //       formattedArray = languages.split(", ");
    //     } else if (languages.includes(",") && !languages.includes(", ")) {
    //       formattedArray = languages.split(",");
    //     } else {
    //       formattedArray = languages.split(" ");
    //     }
    //     return formattedArray;
    //   }

    //   let releaseDatetime;

    //   if (event.releaseDatetime) {
    //     // If Excel date is stored as a number (Excel serial date)
    //     if (typeof event.releaseDatetime === 'number') {
    //       // Convert Excel serial date to JavaScript Date
    //       // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
    //       releaseDatetime = new Date((event.releaseDatetime - 25569) * 86400 * 1000);
    //     }
    //     // If date is already in string format like '2023-05-15T14:30:00'
    //     else if (typeof event.releaseDatetime === 'string') {
    //       releaseDatetime = new Date(event.releaseDatetime);
    //     }
    //   }

    //   return {
    //     defaultLanguageKey: event?.defaultLanguageKey.toString(),
    //     languages: formatLanguagesArray(event?.languages),
    //     eventCategory: event?.eventCategory.toString(),
    //     commonNumber: event?.commonNumber,
    //     country: event?.country.toString(),
    //     releaseDatetime: releaseDatetime,
    //     forecast: Number(event?.forecast || 0),
    //     actual: Number(event?.actual || 0),
    //     prior: Number(event?.prior || 0),
    //     measureUnit: event?.measureUnit.toString(),
    //     importance: event?.importance.toString(),
    //     status: event?.status.toString(),
    //     isActive: event?.isActive,
    //     createdBy: req?.user?.id,
    //     updatedBy: req?.user?.id,
    //     economicEventsTranslationData: [
    //       {
    //         languageKey: event?.languageKey.toString(),
    //         eventName: event?.eventName.toString(),
    //         description: event?.description.toString(),
    //         createdBy: req?.user?.id,
    //         updatedBy: req?.user?.id,
    //       }
    //     ]
    //   }
    // })

    // const eventNames = eventsData.map((item: any) => item?.economicEventsTranslationData?.map((item: any) => item?.eventName)).flat();

    // const isExist = await economicEventsRepository.checkEconomicEventExist({ eventName: eventNames });
    // if (isExist) return message.ECONOMIC_EVENT_ALREADY_EXISTS;

    // const isInvalidCategoryDataExists = eventsData.find((item: any) => {
    //   return !Object.values(enums.ECONOMIC_EVENTS_CATEGORY).includes(item?.eventCategory);
    // });

    // if (isInvalidCategoryDataExists) {
    //   return "Event category is invalid!";
    // }

    // const isInvalidLanguageDataExists = eventsData.find((item: any) => {

    //   const defaultLanguageKeyValid = Object.keys(enums.LANGUAGE_LIST).includes(item?.defaultLanguageKey);
    //   const economicEventsTranslationDataValid = Object.keys(enums.LANGUAGE_LIST).includes(item?.economicEventsTranslationData?.[0]?.languageKey);

    //   return !defaultLanguageKeyValid || !economicEventsTranslationDataValid;
    // });

    // if (isInvalidLanguageDataExists) {
    //   return "Invalid language found!";
    // }

    // //* this is for returning object in response starts
    // const createableEventData: any = [];

    // eventsData.forEach((item: any) => {
    //   createableEventData.push({
    //     eventName: item?.economicEventsTranslationData?.[0]?.eventName,
    //     description: item?.economicEventsTranslationData?.[0]?.description,
    //     languageKey: item?.economicEventsTranslationData?.[0]?.languageKey,
    //     status: item?.status,
    //     releaseDatetime: item?.releaseDatetime,
    //   });
    // });

    // //* this is for returning object in response ends

    // const singleLingualData: any[] = [];
    // const multiLingualData: any[] = [];

    // eventsData.map((item: any) => {
    //   if (item?.languages && Array.isArray(item?.languages) && item?.languages.length > 1) {
    //     multiLingualData.push(item);
    //   } else {
    //     singleLingualData.push(item);
    //   }
    // })


    // return;
    // let sellersData = await partnerRepository.addSellersByPartnerUsingFile(req.user.id);
    // console.log("🚀 ~ sellersData:", sellersData);

    // return sellersData;
  },

};

export default partnerService;
