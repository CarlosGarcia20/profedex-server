import { RekognitionClient, DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";
import 'dotenv/config';

const rekognition = new RekognitionClient({ region: process.env.AWS_REGION });

export const checkContentSafety = async (bucketName, imageName) => {
    const command = new DetectModerationLabelsCommand({
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: imageName,
            },
        },
        MinConfidence: 70, // Solo alerta si la IA está 70% segura
    });

    try {
        const response = await rekognition.send(command);
        
        // Si el array ModerationLabels tiene datos, encontró algo malo
        if (response.ModerationLabels.length > 0) {
            return { 
                isSafe: false, 
                labels: response.ModerationLabels.map(l => l.Name)
            };
        }
        
        return { isSafe: true };
    } catch (error) {
        console.error("Error en Rekognition:", error);
        throw new Error("Error al analizar la imagen");
    }
};