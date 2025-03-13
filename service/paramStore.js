const AWS = require('aws-sdk');

// AWS SSM (Systems Manager) 클라이언트 생성 (리전 설정)
const ssm = new AWS.SSM({ region: 'us-east-1' });

/**
 * Parameter Store에서 특정 값을 가져오는 함수
 * @param {string} paramName - 파라미터 이름 (예: '/myapp/EMAIL_USER')
 * @returns {Promise<string>} - 가져온 값 반환
 */
async function getParameterValue(paramName) {
    try {
        const result = await ssm.getParameter({
            Name: paramName,
            WithDecryption: true  // SecureString 값도 복호화해서 가져옴
        }).promise();

        return result.Parameter.Value;
    } catch (error) {
        console.error(`❌ Error fetching ${paramName}:`, error);
        return null;
    }
}

module.exports = { getParameterValue };
